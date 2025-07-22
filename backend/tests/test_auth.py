"""
Test authentication module.
This module tests the authentication system.
"""
import json
import pytest
from flask_jwt_extended import create_access_token
from app.models.admin_user import AdminUser, AdminRole

def test_admin_user_model(session):
    """Test AdminUser model."""
    # Create admin user
    admin = AdminUser(
        username='testadmin',
        email='testadmin@example.com',
        role=AdminRole.OWNER
    )
    admin.set_password('password123')
    session.add(admin)
    session.commit()
    
    # Test password hashing
    assert admin.password_hash != 'password123'
    assert admin.check_password('password123')
    assert not admin.check_password('wrongpassword')
    
    # Test role methods
    assert admin.is_owner()
    assert admin.is_payment_admin()
    
    # Test to_dict method
    admin_dict = admin.to_dict()
    assert 'password_hash' not in admin_dict
    assert admin_dict['username'] == 'testadmin'
    assert admin_dict['email'] == 'testadmin@example.com'
    assert admin_dict['role'] == 'owner'

def test_admin_login(client, session):
    """Test admin login endpoint."""
    # Create admin user
    admin = AdminUser(
        username='testadmin',
        email='testadmin@example.com',
        role=AdminRole.OWNER
    )
    admin.set_password('password123')
    session.add(admin)
    session.commit()
    
    # Test login with email
    response = client.post('/api/v1/auth/login', json={
        'email': 'testadmin@example.com',
        'password': 'password123'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data
    assert 'refresh_token' in data
    assert data['admin']['username'] == 'testadmin'
    
    # Test login with username
    response = client.post('/api/v1/auth/login', json={
        'username': 'testadmin',
        'password': 'password123'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data
    
    # Test login with wrong password
    response = client.post('/api/v1/auth/login', json={
        'email': 'testadmin@example.com',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    
    # Test login with non-existent user
    response = client.post('/api/v1/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'password123'
    })
    assert response.status_code == 401
    
    # Test login with inactive user
    admin.is_active = False
    session.commit()
    response = client.post('/api/v1/auth/login', json={
        'email': 'testadmin@example.com',
        'password': 'password123'
    })
    assert response.status_code == 403

def test_admin_verify(client, session, app):
    """Test token verification endpoint."""
    # Create admin user
    admin = AdminUser(
        username='testadmin',
        email='testadmin@example.com',
        role=AdminRole.OWNER
    )
    admin.set_password('password123')
    session.add(admin)
    session.commit()
    
    # Create access token
    with app.app_context():
        access_token = create_access_token(identity=str(admin.id))
    
    # Test token verification
    response = client.get('/api/v1/auth/verify', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['valid'] == True
    assert data['admin']['username'] == 'testadmin'
    
    # Test with invalid token
    response = client.get('/api/v1/auth/verify', headers={
        'Authorization': 'Bearer invalid_token'
    })
    assert response.status_code == 422  # JWT Extended returns 422 for invalid tokens

def test_admin_me(client, session, app):
    """Test me endpoint."""
    # Create admin user
    admin = AdminUser(
        username='testadmin',
        email='testadmin@example.com',
        role=AdminRole.OWNER
    )
    admin.set_password('password123')
    session.add(admin)
    session.commit()
    
    # Create access token
    with app.app_context():
        access_token = create_access_token(identity=str(admin.id))
    
    # Test me endpoint
    response = client.get('/api/v1/auth/me', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['admin']['username'] == 'testadmin'

def test_admin_creation(client, session, app):
    """Test admin creation endpoint."""
    # Create owner admin
    owner = AdminUser(
        username='owner',
        email='owner@example.com',
        role=AdminRole.OWNER
    )
    owner.set_password('password123')
    session.add(owner)
    session.commit()
    
    # Create worker admin
    worker = AdminUser(
        username='worker',
        email='worker@example.com',
        role=AdminRole.WORKER
    )
    worker.set_password('password123')
    session.add(worker)
    session.commit()
    
    # Create access tokens
    with app.app_context():
        owner_token = create_access_token(identity=str(owner.id))
        worker_token = create_access_token(identity=str(worker.id))
    
    # Test admin creation by owner
    response = client.post('/api/v1/auth/admin/create', 
        headers={'Authorization': f'Bearer {owner_token}'},
        json={
            'username': 'newadmin',
            'email': 'newadmin@example.com',
            'password': 'password123',
            'role': 'payment_admin'
        }
    )
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['admin']['username'] == 'newadmin'
    assert data['admin']['role'] == 'payment_admin'
    
    # Test admin creation by worker (should fail)
    response = client.post('/api/v1/auth/admin/create', 
        headers={'Authorization': f'Bearer {worker_token}'},
        json={
            'username': 'newadmin2',
            'email': 'newadmin2@example.com',
            'password': 'password123',
            'role': 'worker'
        }
    )
    assert response.status_code == 403
    
    # Test admin creation with duplicate username
    response = client.post('/api/v1/auth/admin/create', 
        headers={'Authorization': f'Bearer {owner_token}'},
        json={
            'username': 'newadmin',
            'email': 'different@example.com',
            'password': 'password123',
            'role': 'worker'
        }
    )
    assert response.status_code == 409
    
    # Test admin creation with invalid role
    response = client.post('/api/v1/auth/admin/create', 
        headers={'Authorization': f'Bearer {owner_token}'},
        json={
            'username': 'newadmin3',
            'email': 'newadmin3@example.com',
            'password': 'password123',
            'role': 'invalid_role'
        }
    )
    assert response.status_code == 400

def test_admin_status_update(client, session, app):
    """Test admin status update endpoint."""
    # Create owner admin
    owner = AdminUser(
        username='owner',
        email='owner@example.com',
        role=AdminRole.OWNER
    )
    owner.set_password('password123')
    session.add(owner)
    
    # Create worker admin
    worker = AdminUser(
        username='worker',
        email='worker@example.com',
        role=AdminRole.WORKER
    )
    worker.set_password('password123')
    session.add(worker)
    session.commit()
    
    # Create access tokens
    with app.app_context():
        owner_token = create_access_token(identity=str(owner.id))
        worker_token = create_access_token(identity=str(worker.id))
    
    # Test status update by owner
    response = client.put(f'/api/v1/auth/admin/{worker.id}/status', 
        headers={'Authorization': f'Bearer {owner_token}'},
        json={'is_active': False}
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['admin']['is_active'] == False
    
    # Test status update by worker (should fail)
    response = client.put(f'/api/v1/auth/admin/{owner.id}/status', 
        headers={'Authorization': f'Bearer {worker_token}'},
        json={'is_active': False}
    )
    assert response.status_code == 403
    
    # Test self-status update (should fail)
    response = client.put(f'/api/v1/auth/admin/{owner.id}/status', 
        headers={'Authorization': f'Bearer {owner_token}'},
        json={'is_active': False}
    )
    assert response.status_code == 400

def test_admin_deletion(client, session, app):
    """Test admin deletion endpoint."""
    # Create owner admin
    owner = AdminUser(
        username='owner',
        email='owner@example.com',
        role=AdminRole.OWNER
    )
    owner.set_password('password123')
    session.add(owner)
    
    # Create worker admin
    worker = AdminUser(
        username='worker',
        email='worker@example.com',
        role=AdminRole.WORKER
    )
    worker.set_password('password123')
    session.add(worker)
    session.commit()
    
    # Create access tokens
    with app.app_context():
        owner_token = create_access_token(identity=str(owner.id))
        worker_token = create_access_token(identity=str(worker.id))
    
    # Test deletion by owner
    response = client.delete(f'/api/v1/auth/admin/{worker.id}', 
        headers={'Authorization': f'Bearer {owner_token}'}
    )
    assert response.status_code == 200
    
    # Verify worker is deleted
    assert AdminUser.query.filter_by(id=worker.id).first() is None
    
    # Test deletion by worker (should fail)
    new_worker = AdminUser(
        username='worker2',
        email='worker2@example.com',
        role=AdminRole.WORKER
    )
    new_worker.set_password('password123')
    session.add(new_worker)
    session.commit()
    
    response = client.delete(f'/api/v1/auth/admin/{new_worker.id}', 
        headers={'Authorization': f'Bearer {worker_token}'}
    )
    assert response.status_code == 403
    
    # Test self-deletion (should fail)
    response = client.delete(f'/api/v1/auth/admin/{owner.id}', 
        headers={'Authorization': f'Bearer {owner_token}'}
    )
    assert response.status_code == 400
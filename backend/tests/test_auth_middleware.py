"""
Test authentication middleware module.
This module tests the authentication middleware and role-based access decorators.
"""
import json
import pytest
from flask import Flask, jsonify
from flask_jwt_extended import create_access_token, JWTManager
from app.models.admin_user import AdminUser, AdminRole
from app.utils.auth import admin_required, role_required, owner_required, payment_admin_required

def test_admin_required_decorator(client, session, app):
    """Test admin_required decorator."""
    # Create test route with admin_required decorator
    @app.route('/test/admin-required')
    @admin_required
    def test_admin_required(admin):
        return jsonify({'success': True, 'admin_id': str(admin.id)})
    
    # Create admin user
    admin = AdminUser(
        username='testadmin',
        email='testadmin@example.com',
        role=AdminRole.WORKER
    )
    admin.set_password('password123')
    session.add(admin)
    session.commit()
    
    # Create access token
    with app.app_context():
        access_token = create_access_token(identity=str(admin.id))
    
    # Test with valid token
    response = client.get('/test/admin-required', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert data['admin_id'] == str(admin.id)
    
    # Test with invalid token
    response = client.get('/test/admin-required', headers={
        'Authorization': 'Bearer invalid_token'
    })
    assert response.status_code == 422  # JWT Extended returns 422 for invalid tokens
    
    # Test with no token
    response = client.get('/test/admin-required')
    assert response.status_code == 401
    
    # Test with inactive admin
    admin.is_active = False
    session.commit()
    
    response = client.get('/test/admin-required', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 401

def test_role_required_decorator(client, session, app):
    """Test role_required decorator."""
    # Create test routes with role_required decorator
    @app.route('/test/owner-role')
    @role_required([AdminRole.OWNER])
    def test_owner_role(admin):
        return jsonify({'success': True, 'role': admin.role.value})
    
    @app.route('/test/payment-admin-role')
    @role_required([AdminRole.PAYMENT_ADMIN, AdminRole.OWNER])
    def test_payment_admin_role(admin):
        return jsonify({'success': True, 'role': admin.role.value})
    
    # Create admin users with different roles
    owner = AdminUser(
        username='owner',
        email='owner@example.com',
        role=AdminRole.OWNER
    )
    owner.set_password('password123')
    session.add(owner)
    
    payment_admin = AdminUser(
        username='payment_admin',
        email='payment@example.com',
        role=AdminRole.PAYMENT_ADMIN
    )
    payment_admin.set_password('password123')
    session.add(payment_admin)
    
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
        payment_admin_token = create_access_token(identity=str(payment_admin.id))
        worker_token = create_access_token(identity=str(worker.id))
    
    # Test owner role endpoint
    # Owner should have access
    response = client.get('/test/owner-role', headers={
        'Authorization': f'Bearer {owner_token}'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert data['role'] == 'owner'
    
    # Payment admin should not have access
    response = client.get('/test/owner-role', headers={
        'Authorization': f'Bearer {payment_admin_token}'
    })
    assert response.status_code == 403
    
    # Worker should not have access
    response = client.get('/test/owner-role', headers={
        'Authorization': f'Bearer {worker_token}'
    })
    assert response.status_code == 403
    
    # Test payment admin role endpoint
    # Owner should have access
    response = client.get('/test/payment-admin-role', headers={
        'Authorization': f'Bearer {owner_token}'
    })
    assert response.status_code == 200
    
    # Payment admin should have access
    response = client.get('/test/payment-admin-role', headers={
        'Authorization': f'Bearer {payment_admin_token}'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert data['role'] == 'payment_admin'
    
    # Worker should not have access
    response = client.get('/test/payment-admin-role', headers={
        'Authorization': f'Bearer {worker_token}'
    })
    assert response.status_code == 403

def test_owner_required_decorator(client, session, app):
    """Test owner_required decorator."""
    # Create test route with owner_required decorator
    @app.route('/test/owner-required')
    @owner_required
    def test_owner_required(admin):
        return jsonify({'success': True, 'role': admin.role.value})
    
    # Create admin users with different roles
    owner = AdminUser(
        username='owner',
        email='owner@example.com',
        role=AdminRole.OWNER
    )
    owner.set_password('password123')
    session.add(owner)
    
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
    
    # Test with owner
    response = client.get('/test/owner-required', headers={
        'Authorization': f'Bearer {owner_token}'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert data['role'] == 'owner'
    
    # Test with worker
    response = client.get('/test/owner-required', headers={
        'Authorization': f'Bearer {worker_token}'
    })
    assert response.status_code == 403

def test_payment_admin_required_decorator(client, session, app):
    """Test payment_admin_required decorator."""
    # Create test route with payment_admin_required decorator
    @app.route('/test/payment-admin-required')
    @payment_admin_required
    def test_payment_admin_required(admin):
        return jsonify({'success': True, 'role': admin.role.value})
    
    # Create admin users with different roles
    owner = AdminUser(
        username='owner',
        email='owner@example.com',
        role=AdminRole.OWNER
    )
    owner.set_password('password123')
    session.add(owner)
    
    payment_admin = AdminUser(
        username='payment_admin',
        email='payment@example.com',
        role=AdminRole.PAYMENT_ADMIN
    )
    payment_admin.set_password('password123')
    session.add(payment_admin)
    
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
        payment_admin_token = create_access_token(identity=str(payment_admin.id))
        worker_token = create_access_token(identity=str(worker.id))
    
    # Test with owner
    response = client.get('/test/payment-admin-required', headers={
        'Authorization': f'Bearer {owner_token}'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert data['role'] == 'owner'
    
    # Test with payment admin
    response = client.get('/test/payment-admin-required', headers={
        'Authorization': f'Bearer {payment_admin_token}'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert data['role'] == 'payment_admin'
    
    # Test with worker
    response = client.get('/test/payment-admin-required', headers={
        'Authorization': f'Bearer {worker_token}'
    })
    assert response.status_code == 403
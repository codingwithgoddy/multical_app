"""
Database initialization script.
Run this script to create the database tables and add some initial data.
"""
from datetime import datetime
from app import create_app
from app.models import db
from app.models.user import User, Address, PaymentMethod
from app.models.product import Category, Product, ProductImage, ProductOption, ProductOptionValue
from app.models.service import Service, ServiceOption, ServiceOptionValue
from app.models.quote import QuoteRequest, QuoteFile, Quote, QuoteItem
from app.models.order import Order, OrderItem, OrderFile, OrderStatus, Payment, Delivery
from app.models.production import ProductionJob, ProductionStep

def init_db():
    """Initialize the database with tables and sample data"""
    app = create_app('development')
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if we already have users
        if User.query.count() == 0:
            print("Adding sample users...")
            # Add admin user
            admin = User(
                username="admin",
                email="admin@multiprints.com",
                is_admin=True,
                phone_number="+254700000000"
            )
            admin.set_password("admin123")
            
            # Add regular user
            user = User(
                username="customer",
                email="customer@example.com",
                is_admin=False,
                phone_number="+254711111111"
            )
            user.set_password("customer123")
            
            db.session.add(admin)
            db.session.add(user)
            db.session.commit()
            
            # Add sample addresses
            admin_address = Address(
                user_id=admin.id,
                street="123 Admin Street",
                city="Nairobi",
                state="Nairobi County",
                postal_code="00100",
                country="Kenya",
                is_default=True
            )
            
            user_address = Address(
                user_id=user.id,
                street="456 Customer Avenue",
                city="Nairobi",
                state="Nairobi County",
                postal_code="00200",
                country="Kenya",
                is_default=True
            )
            
            db.session.add(admin_address)
            db.session.add(user_address)
            db.session.commit()
            
            # Add sample payment methods
            admin_payment = PaymentMethod(
                user_id=admin.id,
                method_type="mpesa",
                provider="Safaricom",
                account_number="+254700000000",
                is_default=True
            )
            
            user_payment = PaymentMethod(
                user_id=user.id,
                method_type="mpesa",
                provider="Safaricom",
                account_number="+254711111111",
                is_default=True
            )
            
            db.session.add(admin_payment)
            db.session.add(user_payment)
            db.session.commit()
            
            print("Sample users, addresses, and payment methods added.")
        
        # Check if we already have categories
        if Category.query.count() == 0:
            print("Adding sample categories...")
            categories = [
                Category(name="Business Cards", description="Professional business cards", slug="business-cards"),
                Category(name="Flyers", description="Marketing flyers and brochures", slug="flyers"),
                Category(name="Banners", description="Large format banners", slug="banners"),
                Category(name="Stationery", description="Letterheads, envelopes, etc.", slug="stationery"),
                Category(name="Stickers", description="Custom stickers and labels", slug="stickers"),
                Category(name="Custom Printing", description="Custom printing services", slug="custom-printing")
            ]
            
            db.session.add_all(categories)
            db.session.commit()
            print("Sample categories added.")
        
        # Check if we already have products
        if Product.query.count() == 0:
            print("Adding sample products...")
            # Get categories
            business_cards = Category.query.filter_by(slug="business-cards").first()
            flyers = Category.query.filter_by(slug="flyers").first()
            banners = Category.query.filter_by(slug="banners").first()
            stickers = Category.query.filter_by(slug="stickers").first()
            
            products = [
                Product(
                    name="Standard Business Card",
                    description="300gsm, full color, double-sided",
                    category_id=business_cards.id,
                    sku="BC-STD-001",
                    pricing_model="fixed",
                    base_price=15.99,
                    min_order_quantity=100,
                    unit_of_measure="piece",
                    active=True,
                    stock_quantity=1000
                ),
                Product(
                    name="Premium Business Card",
                    description="350gsm, full color, double-sided, spot UV",
                    category_id=business_cards.id,
                    sku="BC-PRM-001",
                    pricing_model="fixed",
                    base_price=25.99,
                    min_order_quantity=100,
                    unit_of_measure="piece",
                    active=True,
                    stock_quantity=500
                ),
                Product(
                    name="A5 Flyer",
                    description="170gsm, full color, single-sided",
                    category_id=flyers.id,
                    sku="FL-A5-001",
                    pricing_model="fixed",
                    base_price=12.99,
                    min_order_quantity=100,
                    unit_of_measure="piece",
                    active=True,
                    stock_quantity=2000
                ),
                Product(
                    name="A4 Flyer",
                    description="170gsm, full color, double-sided",
                    category_id=flyers.id,
                    sku="FL-A4-001",
                    pricing_model="fixed",
                    base_price=18.99,
                    min_order_quantity=100,
                    unit_of_measure="piece",
                    active=True,
                    stock_quantity=1500
                ),
                Product(
                    name="Vinyl Banner",
                    description="440gsm, full color, with grommets",
                    category_id=banners.id,
                    sku="BN-VNL-001",
                    pricing_model="per_sqm",
                    base_price=45.99,
                    min_order_quantity=1,
                    unit_of_measure="sqm",
                    active=True,
                    stock_quantity=50
                ),
                Product(
                    name="Vinyl Stickers",
                    description="Waterproof vinyl stickers, full color",
                    category_id=stickers.id,
                    sku="ST-VNL-001",
                    pricing_model="per_meter",
                    base_price=35.99,
                    min_order_quantity=1,
                    unit_of_measure="meter",
                    active=True,
                    stock_quantity=100
                )
            ]
            
            db.session.add_all(products)
            db.session.commit()
            
            # Add sample product images
            for product in products:
                image = ProductImage(
                    product_id=product.id,
                    image_url=f"https://via.placeholder.com/500x500?text={product.name.replace(' ', '+')}",
                    is_primary=True,
                    display_order=1
                )
                db.session.add(image)
            
            # Add sample product options for business cards
            size_option = ProductOption(
                product_id=products[0].id,  # Standard Business Card
                name="size",
                display_name="Card Size",
                required=True
            )
            db.session.add(size_option)
            
            paper_option = ProductOption(
                product_id=products[0].id,  # Standard Business Card
                name="paper",
                display_name="Paper Type",
                required=True
            )
            db.session.add(paper_option)
            
            db.session.commit()
            
            # Add option values
            size_values = [
                ProductOptionValue(option_id=size_option.id, value="Standard (90x50mm)", price_adjustment=0.0, price_adjustment_type="fixed"),
                ProductOptionValue(option_id=size_option.id, value="Square (65x65mm)", price_adjustment=2.0, price_adjustment_type="fixed"),
                ProductOptionValue(option_id=size_option.id, value="Mini (70x28mm)", price_adjustment=1.5, price_adjustment_type="fixed")
            ]
            
            paper_values = [
                ProductOptionValue(option_id=paper_option.id, value="300gsm Silk", price_adjustment=0.0, price_adjustment_type="fixed"),
                ProductOptionValue(option_id=paper_option.id, value="350gsm Silk", price_adjustment=2.0, price_adjustment_type="fixed"),
                ProductOptionValue(option_id=paper_option.id, value="350gsm Uncoated", price_adjustment=2.5, price_adjustment_type="fixed"),
                ProductOptionValue(option_id=paper_option.id, value="400gsm Silk", price_adjustment=3.0, price_adjustment_type="fixed")
            ]
            
            db.session.add_all(size_values)
            db.session.add_all(paper_values)
            db.session.commit()
            
            print("Sample products, images, and options added.")
        
        # Check if we already have services
        if Service.query.count() == 0:
            print("Adding sample services...")
            # Get categories
            custom_printing = Category.query.filter_by(slug="custom-printing").first()
            
            services = [
                Service(
                    name="Custom Design Service",
                    description="Professional design service for your printing needs",
                    category_id=custom_printing.id,
                    base_price=50.00,
                    pricing_model="hourly",
                    active=True
                ),
                Service(
                    name="Rush Printing",
                    description="Expedited printing service for urgent orders",
                    category_id=custom_printing.id,
                    base_price=25.00,
                    pricing_model="fixed",
                    active=True
                ),
                Service(
                    name="Large Format Custom Printing",
                    description="Custom large format printing for special requirements",
                    category_id=custom_printing.id,
                    base_price=100.00,
                    pricing_model="custom",
                    active=True
                )
            ]
            
            db.session.add_all(services)
            db.session.commit()
            
            # Add sample service options
            for service in services:
                if service.name == "Custom Design Service":
                    complexity_option = ServiceOption(
                        service_id=service.id,
                        name="complexity",
                        display_name="Design Complexity",
                        required=True
                    )
                    db.session.add(complexity_option)
                    
                    turnaround_option = ServiceOption(
                        service_id=service.id,
                        name="turnaround",
                        display_name="Turnaround Time",
                        required=True
                    )
                    db.session.add(turnaround_option)
                    
                    db.session.commit()
                    
                    # Add option values
                    complexity_values = [
                        ServiceOptionValue(option_id=complexity_option.id, value="Simple", price_adjustment=0.0, price_adjustment_type="fixed"),
                        ServiceOptionValue(option_id=complexity_option.id, value="Medium", price_adjustment=25.0, price_adjustment_type="fixed"),
                        ServiceOptionValue(option_id=complexity_option.id, value="Complex", price_adjustment=50.0, price_adjustment_type="fixed")
                    ]
                    
                    turnaround_values = [
                        ServiceOptionValue(option_id=turnaround_option.id, value="Standard (3-5 days)", price_adjustment=0.0, price_adjustment_type="fixed"),
                        ServiceOptionValue(option_id=turnaround_option.id, value="Express (1-2 days)", price_adjustment=20.0, price_adjustment_type="fixed"),
                        ServiceOptionValue(option_id=turnaround_option.id, value="Same Day", price_adjustment=50.0, price_adjustment_type="fixed")
                    ]
                    
                    db.session.add_all(complexity_values)
                    db.session.add_all(turnaround_values)
                    db.session.commit()
            
            print("Sample services and options added.")
        
        # Add sample quote requests if none exist
        if QuoteRequest.query.count() == 0:
            print("Adding sample quote requests...")
            
            # Get a service and user
            service = Service.query.first()
            user = User.query.filter_by(username="customer").first()
            
            quote_request = QuoteRequest(
                user_id=user.id,
                service_id=service.id,
                status="pending",
                title="Custom Logo Design",
                description="I need a professional logo designed for my new business",
                requirements="The logo should be modern, clean, and represent a tech company",
                desired_completion_date=datetime.utcnow().date(),
                budget=200.0,
                contact_preference="email"
            )
            
            db.session.add(quote_request)
            db.session.commit()
            
            # Add a sample quote file
            quote_file = QuoteFile(
                quote_request_id=quote_request.id,
                file_url="https://via.placeholder.com/500x500?text=Sample+Logo+Sketch",
                file_name="logo_sketch.jpg",
                file_type="image/jpeg",
                file_size=150000
            )
            
            db.session.add(quote_file)
            db.session.commit()
            
            print("Sample quote requests added.")
        
        # Add sample orders if none exist
        if Order.query.count() == 0:
            print("Adding sample orders...")
            
            # Get a user and product
            user = User.query.filter_by(username="customer").first()
            product = Product.query.first()
            address = Address.query.filter_by(user_id=user.id).first()
            
            order = Order(
                user_id=user.id,
                total_amount=product.base_price * 100,  # 100 business cards
                status="pending",
                payment_status="unpaid",
                address_id=address.id,
                notes="Please deliver ASAP"
            )
            
            db.session.add(order)
            db.session.commit()
            
            # Add order item
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=100,
                unit_of_measure=product.unit_of_measure,
                price=product.base_price,
                options_json='{"size": "Standard (90x50mm)", "paper": "300gsm Silk"}'
            )
            
            db.session.add(order_item)
            
            # Add order status
            order_status = OrderStatus(
                order_id=order.id,
                status="pending",
                notes="Order received"
            )
            
            db.session.add(order_status)
            db.session.commit()
            
            # Add sample order file
            order_file = OrderFile(
                order_item_id=order_item.id,
                file_url="https://via.placeholder.com/500x500?text=Business+Card+Design",
                file_name="business_card_design.pdf",
                file_type="application/pdf",
                file_size=250000
            )
            
            db.session.add(order_file)
            db.session.commit()
            
            # Add production job
            production_job = ProductionJob(
                order_id=order.id,
                order_item_id=order_item.id,
                status="queued",
                priority="normal",
                notes="Standard business cards"
            )
            
            db.session.add(production_job)
            db.session.commit()
            
            # Add production steps
            steps = [
                ProductionStep(
                    job_id=production_job.id,
                    name="Design Verification",
                    status="pending"
                ),
                ProductionStep(
                    job_id=production_job.id,
                    name="Printing",
                    status="pending"
                ),
                ProductionStep(
                    job_id=production_job.id,
                    name="Cutting",
                    status="pending"
                ),
                ProductionStep(
                    job_id=production_job.id,
                    name="Quality Check",
                    status="pending"
                ),
                ProductionStep(
                    job_id=production_job.id,
                    name="Packaging",
                    status="pending"
                )
            ]
            
            db.session.add_all(steps)
            db.session.commit()
            
            print("Sample orders and production jobs added.")
        
        print("Database initialization completed.")

if __name__ == "__main__":
    init_db()
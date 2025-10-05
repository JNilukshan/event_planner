#!/bin/bash

# Quick fix for nginx 500 error
echo "🔧 Fixing nginx configuration for Event Planner..."

# Check if files exist and their permissions
echo "📁 Current file structure:"
ls -la /home/azureuser/event_planner/

# Stop nginx to avoid conflicts
sudo systemctl stop nginx

# Fix permissions - make files readable by nginx
echo "🔐 Fixing permissions..."
sudo chown -R www-data:www-data /home/azureuser/event_planner
sudo chmod -R 755 /home/azureuser/event_planner
sudo chmod 644 /home/azureuser/event_planner/* 2>/dev/null || true

# Create a simple working nginx config
echo "📝 Creating simple nginx config..."
sudo tee /etc/nginx/sites-available/event-planner-working > /dev/null << 'EOF'
server {
    listen 3000;
    server_name _;
    
    root /home/azureuser/event_planner;
    index index.html;
    
    # Simple location block
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Health check
    location /health {
        return 200 "Event Planner OK";
        add_header Content-Type text/plain;
    }
    
    # Error and access logs
    error_log /var/log/nginx/event-planner-error.log;
    access_log /var/log/nginx/event-planner-access.log;
}
EOF

# Remove old configs and enable new one
sudo rm -f /etc/nginx/sites-enabled/event-planner*
sudo ln -sf /etc/nginx/sites-available/event-planner-working /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Config is valid, starting nginx..."
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    # Wait a moment for nginx to start
    sleep 2
    
    echo ""
    echo "🎉 Testing the application..."
    
    # Test locally first
    echo "Local test:"
    curl -I http://localhost:3000 2>/dev/null || echo "Local test failed"
    
    echo ""
    echo "🌐 Your app should now be available at:"
    echo "   http://$(curl -s ifconfig.me):3000"
    
    echo ""
    echo "📋 Debug information:"
    echo "Files in directory:"
    ls -la /home/azureuser/event_planner/
    
    echo ""
    echo "File ownership:"
    ls -la /home/azureuser/event_planner/index.html 2>/dev/null || echo "index.html not found!"
    
    echo ""
    echo "Nginx status:"
    sudo systemctl status nginx --no-pager
    
else
    echo "❌ Nginx config has errors:"
    sudo nginx -t
    
    echo ""
    echo "📋 Checking error logs:"
    sudo tail -10 /var/log/nginx/error.log
fi

echo ""
echo "🔍 If still not working, check:"
echo "1. Files exist: ls -la /home/azureuser/event_planner/"
echo "2. Nginx errors: sudo tail -f /var/log/nginx/error.log"
echo "3. Access logs: sudo tail -f /var/log/nginx/access.log"
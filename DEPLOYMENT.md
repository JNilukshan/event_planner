# GitHub Actions CI/CD Setup Guide

This guide will help you set up automated deployment of your React Event Planner app to your Azure VM using GitHub Actions.

## 🏗️ Architecture Overview

```
GitHub Repository → GitHub Actions → Azure VM
    ↓                    ↓              ↓
 Code Push          Build & Test    Deploy & Serve
```

## 🚀 Quick Setup Steps

### 1. **Wait for Terraform Deployment to Complete**
Your Terraform deployment is currently running. Wait for it to complete and note the VM's public IP address.

### 2. **Setup VM for GitHub Actions**
SSH into your VM and run the setup script:

```bash
# Get your VM IP from terraform output
terraform output vm_public_ip

# SSH into your VM
ssh azureuser@<YOUR_VM_IP>

# Download and run the setup script
wget https://raw.githubusercontent.com/JNilukshan/event_planner/main/azure_infra/github-actions-setup.sh
chmod +x github-actions-setup.sh
./github-actions-setup.sh
```

### 3. **Configure GitHub Secrets**
Go to your GitHub repository settings and add these secrets:

```
Settings → Secrets and variables → Actions → New repository secret
```

Add these secrets:
- **`VM_HOST`**: Your VM's public IP address (from terraform output)
- **`VM_USERNAME`**: `azureuser`
- **`VM_PASSWORD`**: The password from your terraform.tfvars file

### 4. **Trigger Deployment**
Push your code to the main branch:

```bash
git add .
git commit -m "Add GitHub Actions deployment pipeline"
git push origin main
```

## 🔄 Deployment Process

The GitHub Actions workflow will:

1. **Build Stage**:
   - Checkout code
   - Install Node.js dependencies
   - Run linting
   - Build the React app
   - Upload build artifacts

2. **Deploy Stage** (only on main branch):
   - Download build artifacts
   - Connect to your Azure VM via SSH
   - Create backup of current deployment
   - Transfer new build files
   - Configure PM2 process manager
   - Update nginx configuration
   - Restart services

3. **Health Check**:
   - Verify the application is responding
   - Check health endpoint

## 🌐 Access Your Application

After successful deployment:

- **Main App**: `http://<YOUR_VM_IP>` (via nginx proxy)
- **Direct Access**: `http://<YOUR_VM_IP>:3000`
- **Health Check**: `http://<YOUR_VM_IP>/health`
- **Server Info**: `http://<YOUR_VM_IP>` (when no app is deployed)

## 📁 File Structure

```
.github/
└── workflows/
    └── deploy.yml          # Main deployment workflow

azure_infra/
├── main.tf                 # Terraform VM configuration
├── github-actions-setup.sh # VM setup script
└── ...other terraform files

src/                        # Your React app source code
├── components/
├── contexts/
└── ...
```

## 🔧 Monitoring & Management

### PM2 Commands (on VM)
```bash
pm2 list                    # Show running processes
pm2 logs event-planner      # Show app logs
pm2 restart event-planner   # Restart app
pm2 stop event-planner      # Stop app
pm2 delete event-planner    # Remove app from PM2
```

### Nginx Commands (on VM)
```bash
sudo systemctl status nginx    # Check nginx status
sudo systemctl restart nginx   # Restart nginx
sudo nginx -t                  # Test nginx configuration
sudo tail -f /var/log/nginx/access.log  # View access logs
```

### Application Logs (on VM)
```bash
# PM2 logs
pm2 logs

# Application specific logs
tail -f /opt/react-app1/logs/combined.log
tail -f /opt/react-app1/logs/err.log
tail -f /opt/react-app1/logs/out.log
```

## 🔄 Workflow Triggers

The deployment will trigger on:
- **Push to main branch** (automatic deployment)
- **Push to develop branch** (build only, no deployment)
- **Pull requests to main** (build and test only)
- **Manual trigger** (workflow_dispatch)

## 🛠️ Customization

### Environment Variables
Add environment variables to the workflow by modifying the PM2 ecosystem config:

```javascript
// In ecosystem.config.js
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  API_URL: 'https://your-api.com'
}
```

### Multiple Environments
To deploy to different environments:

1. Create separate branches (staging, production)
2. Duplicate the workflow file
3. Use different VM credentials for each environment

### Database Integration
If you add a database later:

1. Update the nginx configuration to proxy API calls
2. Add database connection strings as GitHub secrets
3. Modify the deployment script to handle database migrations

## 🚨 Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Check VM_HOST, VM_USERNAME, VM_PASSWORD secrets
   - Verify VM is running and accessible
   - Check NSG rules allow SSH (port 22)

2. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json
   - Check for linting errors

3. **App Not Accessible**
   - SSH into VM and run: `pm2 list`
   - Check nginx status: `sudo systemctl status nginx`
   - Check port 3000 is not blocked: `netstat -tlnp | grep 3000`

4. **Health Check Fails**
   - Verify the /health endpoint is configured in nginx
   - Check if the app is actually running: `curl localhost:3000`

### Debug Commands

```bash
# On your VM, check what's running
pm2 list
pm2 logs
sudo systemctl status nginx
netstat -tlnp

# Test local connectivity
curl localhost:3000
curl localhost/health

# Check file permissions
ls -la /opt/react-app1/
```

## 📈 Performance Optimization

### Caching
The nginx configuration includes:
- Static asset caching (1 year)
- Gzip compression ready
- Browser caching headers

### Scaling
To handle more traffic:
1. Increase PM2 instances: `instances: 'max'` in ecosystem.config.js
2. Add load balancer (Azure Load Balancer)
3. Scale VM size in terraform variables

### SSL/HTTPS
To add SSL:
1. Get SSL certificate (Let's Encrypt, Azure Certificate)
2. Update nginx configuration
3. Redirect HTTP to HTTPS

## 🔐 Security Best Practices

1. **Use SSH Keys** instead of passwords (update workflow)
2. **Limit SSH access** by IP in NSG rules
3. **Regular updates**: `apt update && apt upgrade`
4. **Monitor access logs**: `/var/log/nginx/access.log`
5. **Use environment variables** for sensitive data

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. SSH into VM and check application logs
3. Verify all services are running
4. Test manual deployment steps

Your Event Planner app will be automatically deployed whenever you push to the main branch! 🎉
# Simple Deployment Setup

## 🚀 Quick Steps

### 1. Wait for VM to be Ready
Your Terraform is still creating the VM. Wait for it to complete, then get the VM IP:

```powershell
cd azure_infra
terraform output vm_public_ip
```

### 2. Setup VM (One-time)
SSH into your VM and run these commands:

```bash
# SSH into VM (replace with your actual IP)
ssh azureuser@YOUR_VM_IP

# Install Node.js and PM2
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2 serve

# Test
echo "Setup complete!"
```

### 3. Add GitHub Secrets
Go to your GitHub repository:
- Settings → Secrets and variables → Actions → New repository secret

Add these 3 secrets:
- `VM_HOST`: Your VM's public IP (from step 1)
- `VM_USERNAME`: `azureuser`
- `VM_PASSWORD`: Your VM password (from terraform.tfvars file)

### 4. Deploy
Just push to main branch:

```bash
git add .
git commit -m "Add simple deployment"
git push origin main
```

## 🌐 Access Your App

After deployment, visit:
- `http://YOUR_VM_IP:3000`

## 📋 What the Workflow Does

1. **Builds** your React app (`npm run build`)
2. **Copies** the `dist/` folder to VM (`/home/azureuser/event_planner/`)
3. **Starts** the app using PM2 and serve on port 3000

## 🔧 Manage Your App

SSH into VM and use these commands:

```bash
# Check app status
pm2 list

# View logs
pm2 logs event-planner

# Restart app
pm2 restart event-planner

# Stop app
pm2 stop event-planner
```

That's it! Your app will auto-deploy whenever you push to main! 🎉
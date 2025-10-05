output "vm_public_ip" {
  description = "Public IP address of the Azure VM"
  value       = azurerm_public_ip.public_ip.ip_address
}

output "vm_admin_username" {
  description = "Admin username used to SSH into the VM"
  value       = var.admin_username
}

output "vm_name" {
  description = "Name of the deployed virtual machine"
  value       = azurerm_linux_virtual_machine.vm.name
}

output "ssh_connection_command" {
  description = "SSH command to connect to the VM"
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.public_ip.ip_address}"
}

output "react_app_urls" {
  description = "URLs to access the React applications"
  value = {
    app1_dev    = "http://${azurerm_public_ip.public_ip.ip_address}:3000"
    app2_dev    = "http://${azurerm_public_ip.public_ip.ip_address}:3001"
    nginx_proxy = "http://${azurerm_public_ip.public_ip.ip_address}"
    https_proxy = "https://${azurerm_public_ip.public_ip.ip_address}"
  }
}

output "network_security_group" {
  description = "Network Security Group name"
  value       = azurerm_network_security_group.nsg.name
}

output "deployment_notes" {
  description = "Important notes for deployment"
  value = <<-EOT
    VM Setup Complete! 
    
    Next steps:
    1. SSH into the VM: ssh ${var.admin_username}@${azurerm_public_ip.public_ip.ip_address}
    2. Upload your React apps to /opt/react-app1 and /opt/react-app2
    3. Install dependencies: cd /opt/react-app1 && npm install
    4. Start apps with PM2: pm2 start npm --name "app1" -- start
    5. Configure nginx reverse proxy if needed
    
    Available ports:
    - SSH: 22
    - HTTP: 80
    - HTTPS: 443  
    - React App 1: 3000
    - React App 2: 3001
    - Custom services: 8000-8999
  EOT
}

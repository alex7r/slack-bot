Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"
  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.provision "shell", inline: <<-SHELL
    cd /vagrant
    apt-get update
    apt-get install zip -y
    wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
    unzip ./ngrok-stable-linux-amd64.zip

    curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
    bash nodesource_setup.sh
    apt-get install nodejs build-essential -y
  SHELL
end

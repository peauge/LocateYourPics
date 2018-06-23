# LocateYourPics Présentation

L'application premet de prendre des photos sur des spots et de stocker celle-ci à l'emplacement ou elle a été prise, ce qui permet de la retrouver facilement sur la carte.<br/>
On retrouvera notament :
- un gestionnaire des paramètres liés au compte.
- un gestionnaire des images prises.
- un gestionnaire de son profil et de ses amis.
- une recherche pour retouver et ajouter ses amis.
- une carte pour retrouver et afficher ses photos et celles de ses amis.

# Mise en place du Projet

Mise en place du client (Android, iOS) sur deux systèmes d’exploitation différent, Linux (Ubuntu 16.04 LTS) et Windows (minimum Windows 10).

## 1. Linux

La première étape est d’avoir accès aux dossiers github de notre projet.

git clone https://github.com/peauge/LocateYourPics

• NodeJS installation : <br/>
`sudo apt-get update && curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - && sudo apt-get install -y nodejs && sudo apt-get install npm` <br/>
Cette commande va vous permettre d’acquérir NodeJS et également le logiciel npm qui va vous aidez par la suite à installer des modules et des paquets pour NodeJS.

• JDK installation :<br/>
Pour installer Java et le JDK, rendez-vous à l’adresse suivante :<br/>
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html<br/>

Assurez vous d’avoir les droits d’administrateur et installez le JDK en créant un nouveau dossier dans /opt avec le commande :<br/>
`mkdir /opt/jdk`

Rendez-vous dans ce dossier :<br/>
`cd /opt/jdk/`

Puis extrayez l’archive téléchargée dans le nouveau dossier avec la commande :<br/>
`tar -xf /home/<user>/Téléchargements/jdk-8u<xx>-linux-x64.tar.gz`<br/>

Il faut ensuite indiquer à votre système de prendre en compte ce JDK quand vous lancerez java. Pour cela utilisez les deux commandes suivantes :<br/>
```
 update-alternatives --install /usr/bin/java java /opt/jdk/jdk1.8.0_<xx>/bin/java 10000
 update-alternatives --install /usr/bin/javac javac /opt/jdk/jdk1.8.0_<xx>/bin/javac 10000
 ```
• SDK Android installation :<br/>
Commencez par Installer des librairies de compatibilité pour les systèmes 64 bits avec la commande suivante :<br/>
`apt-get install lib32z1 lib32ncurses5 /*lib32bz2-1.0*/ lib32stdc++6`

Téléchargez Android Studio à l’adresse suivante :<br/>
https://developer.android.com/studio/index.html#linux-bundle<br/>
Cela permet d’obtenir le SDK Android ainsi qu’un gestionnaire d’émulateurs.<br/>
Assurez vous d’avoir les droits d’administrateur et installez Android Studio en créant un nouveau dossier dans /opt avec la commande :<br/>
`mkdir /opt/android-studio`

Rendez-vous dans ce dossier :<br/>
`cd /opt/android-studio/`

Puis extrayez l’archive téléchargée dans le nouveau dossier avec la commande :<br/>
`unzip ~/Téléchargements/android-studio-ide-162.3764568-linux.zip`

Lancer le Android studio avec la commande :<br/>
`./studio`

Compléter l’installation et installer les JDK 23 et supérieurs dans /home/<user>/Android.<br/>
Ajouter les chemins du SDK et des outils android dans le bashrc afin de rendre leurs binaires disponibles, à l’aide des commandes suivantes:<br/>
```
echo "export PATH=\${PATH}:$(pwd)" >> ~/.bashrc
cd ../platform-tools
echo "export PATH=\${PATH}:$(pwd)" >> ~/.bashrc
. ~/.bashrc
echo "export ANDROID_HOME=~/Android/android-sdk-linux" >> ~/.bashrc
```
Dans le répertoir du projet on installe les dépendances.<br/>
`npm install`
 
Installez ensuite le client React-native (nécessite d’avoir les droits administrateur) :<br/>
`npm install -g react-native-cli`

Lancez l’émulateur android d’Android studio.<br/>

Puis dans un autre terminal la commande :<br/>
`adb logcat *:S ReactNative:V ReactNativeJS:V`

qui vous permettra de voir les logs de la console de l’émulateur.

Enfin dans un troisième terminal, compilez l'application et lancez là sur le smartphone :<br/>
`react-native run-android.`

## 2. Windows

Premièrement, vous allez installer git, rendez-vous à l’adresse suivante :<br/>
https://git-scm.com/download/win<br/>

Depuis la barre de recherche windows, tapez “bash” et cliquez sur le logiciel trouvé, un terminal se lance. C’est ce terminal que nous utiliserons pour exécuter toutes les commandes suivante.

`git clone https://github.com/peauge/LocateYourPics`

• NodeJS installation :<br/>
Pour installer NodeJS, rendez-vous à l’adresse suivante :<br/>
https://nodejs.org/dist/v6.10.0/node-v6.10.0-x64.msi

Cette installation va vous permettre d’acquérir NodeJS et également le logiciel npm qui va vous aidez par la suite à installer des modules et des paquets pour NodeJS.<br/>
• JDK installation :<br/>
Pour installer Java et le JDK, rendez-vous à l’adresse suivante :<br/>
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html<br/>

Vous avez maintenant Java installé sur votre ordinateur.<br/>
• Android Studio installation :<br/>
Pour installer Android Studio, rendez-vous à l’adresse suivante :<br/>
https://developer.android.com/studio/index.html#win-bundle

Faites attention à bien cochez toutes les cases lors de l’étape : Choisir les composants.<br/> Quand vous arrivez sur la fenêtre d’accueil sur android-studio, cliquez sur “Configure” puis choisissez “SDK Manager” dans le menu déroulant.<br/> Installez tous les SDK supérieurs à la version 6 (incluse) ainsi que, dans l’onglet “SDK Tools”, Android SDK Build-tools (dernière version et version 24.0.0), tools, platform-tools, Android Emulator et Intel x86 Emulator Accelerator.<br/> Cliquez sur Apply et suivez les instructions.<br/> Créez ensuite un projet (laissez les paramètres par défaut) pour avoir accès au gestionnaire d’émulateurs.<br/> Cliquez dans la barre d’outils sur l'icône AVD Manager (un petit droïde avec un smartphone).<br/> Dans la nouvelle fenêtre, cliquez sur “créer un appareil virtuel”. <br/>Suivez les indications, créez le modèle sélectionné par défaut (Nexus 5x).<br/> Lancez le depuis l’interface graphique pour vérifier son bon fonctionnement. Suivez les instructions en cas de problème.<br/>
Créez les variables d’environnement JAVA_HOME et ANDROID_HOME.<br/> Pour cela faites un clic droit sur “This PC”, sélectionnez Properties, dans le menu de gauche cliquez sur “advanced system settings”.<br/> Dans la nouvelle fenêtre cliquez sur “variables d’environnement”.<br/> Cliquez sur New et créez les variables JAVA_HOME et ANDROID_HOME en indiquant respectivement comme valeur l’emplacement de votre SDK (Il se trouve dans le SDK Manager d’Android Studio, en haut de la fenêtre) et de votre JDK.<br/> Double-cliquez maintenant sur la variable Path, puis cliquez sur new deux fois pour entrer les deux valeurs suivantes ANDROID_HOME \tools et ANDROID_HOME \platform-tools.<br/> Cliquez sur OK pour valider.<br/>

• Dans le répertoir du projet on installe les dépendances<br/>
`npm install`

Installez ensuite le client React-native (nécessite d’avoir les droits administrateur) :<br/>
`npm install -g react-native-cli `

Lancez l’émulateur android d’Android studio avec la commande suivante :<br/>
`C:\...\AppData\Local\Android\sdk\emulator\emulator.exe -netdelay none -netspeed full -avd nom_de_emulateur`

Lancez ensuite le serveur de bundle de react native avec la commande :<br/>
`react-native start`

Puis dans un autre terminal la commande :<br/>
`adb logcat *:S ReactNative:V ReactNativeJS:V  `

qui vous permettra de voir les logs de la console de l’émulateur.

Enfin dans un troisième terminal, compilez l'application et lancez là sur le smartphone :<br/>
`react-native run-android.`

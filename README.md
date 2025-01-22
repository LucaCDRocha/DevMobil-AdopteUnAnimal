# DevMobil-AdopteUnAnimal
## Description
DevMobil-AdopteUnAnimal est une PWA qui permet aux SPAs de mettre leurs animaux à adopter. Il y a donc un espace pour les SPAs et un pour les personnes qui souhaitent adopter un animal.
### SPA
Dans la partie des SPAs, il est possible de 
- Créer/modifier/supprimer une SPA
- créer/modifer/supprimer des animaux
- Discuter avec les clients qui souhaitent adopter animal.
- Mettre une adoption comme : en attente, refusée, indisponible et acceptée. Si plusieurs personnes sont intéressées par le même animal, et qu'une personne est acceptée, les autres sont automatiquement mis en indisponible. Une fois qu'un animal est adopté, il n'est plus visible par les clients.
### Client
Dans la partie des clients, il est possble de 
- Créer/modifier/supprimer un compte
- Aimer des animaux. Les animaux sont classés en fonction de la localisation du client et de l'animal.
- Communiquer avec la spa de l'animal si animal est aimé
- Voir si la demande d'adoption est en attente, refusée, acceptée ou indisponible.
- De disliker un animal
- De voir l'historique des likes et dislikes et de supprimer l'historique. Si un animal est supprimé de l'historique, l'animal va réapparaitre dans la liste des animaux que le client peux adopter.

## Installation
Afin d'installer le code de l'application et pour le faire fonctionner en local, il faut : 
- **pull** de repository
- modifier le fichier **.env-example** en **.env**
- faire un **npm i**
- faire **npm run dev**

>Installer le back-end de l'application sur ce lien : [ici](https://github.com/LucaCDRocha/ArchiOWeb-AdopteUnAnimal)

# DevMobil-AdopteUnAnimal
## Description
DevMobil-AdopteUnAnimal est une application web progressive (PWA) conçue pour aider les refuges pour animaux (SPAs) à proposer leurs animaux à l'adoption. L'application comporte deux sections : une pour les SPAs et une autre pour les utilisateurs cherchant à adopter un animal.

### Espace SPA
Dans la section dédiée aux SPAs, il est possible de :
- Créer, modifier et supprimer des fiches de SPAs.
- Gérer les fiches des animaux (créer, modifier, supprimer).
- Communiquer avec les utilisateurs intéressés par l'adoption.
- Gérer les statuts des demandes d'adoption (en attente, refusée, indisponible, acceptée). Si une adoption est acceptée pour un animal, toutes les autres demandes pour ce même animal sont automatiquement marquées comme "indisponible". Une fois l'animal adopté, il n'est plus visible par les clients.

### Espace Client
Dans la section client, les clients peuvent :
- Créer, modifier ou supprimer leur compte.
- Aimer des animaux, avec un classement basé sur la localisation du client et de l'animal.
- Communiquer avec la SPA lorsqu'un animal est ajouté aux favoris.
- Suivre l'état de leur demande d'adoption (en attente, refusée, acceptée ou indisponible).
- Retirer un animal de leurs favoris (disliker).
- Consulter l'historique de leurs interactions (likes et dislikes) et le supprimer. Si un animal est retiré de l'historique, il réapparaît dans la liste des animaux disponibles à l'adoption.

## Installation
Afin d'installer le code de l'application et pour le faire fonctionner en local, il faut : 
- **clone** le repository
```bash
git clone https://github.com/LucaCDRocha/DevMobil-AdopteUnAnimal.git
```
- renomer le fichier **.env-example** en **.env**
- faire un **npm i**
```bash
npm i
```
- faire **npm run dev**
```bash
npm run dev
```
- Installer le back-end de l'application sur ce lien : [ici](https://github.com/LucaCDRocha/ArchiOWeb-AdopteUnAnimal)

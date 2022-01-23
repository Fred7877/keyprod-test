# Keyprod test
### Authentification
Pour s'authentifier, il faut renseigner les champs user name et password, vous trouverez une liste des d'utilisateurs ici  
`[
{
"username": "logisticien1",
"password": "password"
},
{
"username": "logisticien2",
"password": "password"
},
{
"username": "Robert",
"password": "password"
}
]`

Cette liste se trouve également dans le fichier   
`./src/mocks/data/users.json`

### Commandes
Il y a une liste des commandes ici :  
`[
{
"number": 1,
"name": "Order 1",
"datetime_order": "2021/02/12 15h08",
"orderer": "Airbus",
"items": [
{
"name": "Product 1",
"qrCode": "KeyNetic_V1_LDKGIT",
"weight": 2,
"quantity": 2
},
{
"name": "Product 2",
"qrCode": "KeyVibe_V2_WMDPAM",
"weight": 1,
"quantity": 4
},
{
"name": "Product 3",
"qrCode": "KeyNetic_V1_BQPMMA",
"weight": 3.5,
"quantity": 5
},
{
"name": "Product 4",
"qrCode": "KeyNetic_V3_AMAMAQ",
"weight": 0.4,
"quantity": 1
},
{
"name": "Product 5",
"qrCode": "KeyNetic_V1_CCMQPA",
"weight": 0.9,
"quantity": 35
}
]
},
{
"number": 2,
"name": "Order 2",
"datetime_order": "2021/05/29 08h08",
"orderer": "Toto",
"items": [
{
"name": "Product 1",
"qrCode": "KeyNetic_V1_LDKGIT",
"weight": 2,
"quantity": 15
},
{
"name": "Product 2",
"qrCode": "KeyVibe_V2_WMDPAM",
"weight": 1,
"quantity": 5
},
{
"name": "Product 3",
"qrCode": "KeyNetic_V1_BQPMMA",
"weight": 3.5,
"quantity": 2
}
]
},
{
"number": 3,
"name": "Order 3",
"datetime_order": "2019/11/29 11h34",
"orderer": "Tata",
"items": [
{
"name": "Product 1",
"qrCode": "KeyNetic_V1_LDKGIT",
"weight": 2,
"quantity": 3
},
{
"name":  "Product 2",
"qrCode": "KeyVibe_V2_WMDPAM",
"weight": 1,
"quantity": 10
}
]
},
{
"number": 4,
"name": "Order 4",
"datetime_order": "2018/08/13 22h30",
"orderer": "Titi",
"items": [
{
"name": "Product 1",
"qrCode": "KeyNetic_V1_LDKGIT",
"weight": 1,
"quantity": 8
},
{
"name":"Product 2",
"qrCode": "KeyVibe_V2_WMDPAM",
"weight": 1,
"quantity": 22
},
{
"name":"Product 3",
"qrCode": "KeyNetic_V1_BQPMMA",
"weight": 3.5,
"quantity": 4
},
{
"name":"Product 4",
"qrCode": "KeyNetic_V3_AMAMAQ",
"weight": 0.4,
"quantity": 45
}
]
},
{
"number": 5,
"name": "Order 5",
"datetime_order": "2021/03/17 12h32",
"orderer": "Renault",
"items": [
{
"name": "Product 1",
"qrCode": "KeyNetic_V1_LDKGIT",
"weight": 1,
"quantity": 6
}
]
},
{
"number": 6,
"name": "Order 6",
"datetime_order": "2021/01/17 12h32"
}
]`

Vous trouverez également cette liste dans le fichier  
`./src/mocks/data/orders.json`

# CasaOne case study
> This is a complete project to handle variable components of a product

This rest application has been build using **nodejs v10.19.0** javascript engine and **mongodb v4.2.9** as backend database

>### Steps to run rest server:
1. Start mongo server. Make sure it is running on _localhost:27017_
2. Run following command to create database, collection and sample data.
```
node sampledatacreator.js
```
3. Run application
```
node index.js
```

>## **Assembly time management**

To fetch product info for productid 1234 try following url:

[localhost:2020/productinfo/fetch?q={"productid":1234}](localhost:2020/productinfo/fetch?q={"productid":1234})

Some examples for payloads which can be passed with above API:

``` json
{"sortby":"atime","sortorder":"desc"}
```

``` json
{"sortby":"price","sortorder":"asc"}
```

``` json
{"productid":1234}
```

``` json
{"color":"white"}
```

``` json
{"minatime":9,"maxatime":10},result_count:1}
```

To update assembly time of product with productid 1234 with 40(minutes) try following url:

> [localhost:2020/updateatime/1234?atime=40](localhost:2020/updateatime/1234?atime=40)

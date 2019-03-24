# Test assignment 8

https://github.com/datsoftlyngby/soft2019spring-test/blob/master/Slides/08%20Functional%20testing.pdf

The webapp runs as a [dotnet webapp (from my team member jacob)](https://github.com/cph-js284/Assignment8Test) in a container with a mongo db database

The tests are written in nodejs with selenium as the runner, find it at test/testOrders.js

## Run it

Start up a container running MongoDb by executing

```
sudo docker run -d --rm -p 27017:27017 --name dbms mongo
```

start up the marioapp container and link it to the dbms container by executing

```
sudo docker run -d --rm -p 8080:80 --link dbms:mongo --name marioapp bslcphbussiness/marioapp
```

And the page will now be accessible via http://localhost:8080

```
sudo docker run --link marioapp:siteToTest bslcphbussiness/marioapp-selenium-test
```

### Test output

```
> test-api@1.0.0 test /home/benjamin/Desktop/test-assignement8
> mocha



  Orders
    ✓ Testing order flow (2414ms)
    ✓ Removes orders (1711ms)


  2 passing (4s)
```

## Cleanup

```
sudo docker rm -f marioapp
sudo docker rm -f dbms
sudo docker rmi bslcphbussiness/marioapp-selenium-test
sudo docker rmi bslcphbussiness/marioapp
```

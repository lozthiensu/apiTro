/**
 * Created by baohq on 7/28/16.
 */
var Config = require('../config/config'),
    SORTBY = 'created_time',
    User = require('mongoose').model('User'),
    Price = require('mongoose').model('Price'),
    Location = require('mongoose').model('Location'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    dateTime = require('node-datetime');

exports.login = function (req, res) {
    try {
        var id = '';
        var queryNew = {};
        var queryUpdate = {};
        var today = dateTime.create();
        var todayTimeStamp = today.now();
        if (!!req.body._id && !!req.body.accessToken) {
            var player = '';
            if (!!req.body.playerId)
                player = req.body.playerId;
            queryUpdate = {
                _id: req.body._id,
                accessToken: req.body.accessToken,
                logged_time: todayTimeStamp,
                playerId: player
            }
            queryNew = {
                _id: req.body._id,
                accessToken: req.body.accessToken,
                address: '',
                logged_time: todayTimeStamp,
                created_time: todayTimeStamp,
                address: '',
                playerId: '',
                location: {
                    lat: 0.0,
                    lng: 0.0
                },
                price: 0,
                typeNotification: 0
            }
        } else {
            res.json({
                status: 'ERROR'
            });
        }
        console.log(todayTimeStamp);
        console.log(req.body._id);
        console.log(req.body.accessToken);
        User.findOne({
                "_id": queryUpdate._id,
            },
            function (errFind, rsFind) {
                if (!!errFind) {
                    console.log('Error', errFind);
                    res.status(400).send();
                } else {
                    if (!!rsFind) {
                        User.findOneAndUpdate({
                                "_id": queryUpdate._id,
                            }, {
                                $set: {
                                    "accessToken": queryUpdate.accessToken,
                                    "logged_time": queryUpdate.logged_time,
                                    "playerId": queryUpdate.playerId
                                }
                            }, {
                                new: true
                            },
                            function (errSet, rsSet) {
                                if (errSet) {
                                    console.log('Error', errSet);
                                    res.status(400).send();
                                } else {
                                    console.log('Update', rsSet);
                                    res.json(rsSet);
                                }
                            }
                        );
                    } else {
                        var newUser = new User(queryNew);
                        newUser.save(queryNew,
                            function (errInsert, rsInsert) {
                                if (!!errInsert) {
                                    console.log('Error', errInsert);
                                    res.status(400).send();
                                } else {
                                    console.log('Update', rsInsert);
                                    res.json(queryNew);
                                }
                            }
                        );

                    }
                }
            });

    } catch (err) {
        console.log(err);
    }
};

exports.setTypeNotification = function (req, res) {
    console.log();
    try {
        var query = {};
        if (!!req.body._id && !!req.body.accessToken && !!req.body.typeNotification) {
            query = {
                _id: req.body._id,
                accessToken: req.body.accessToken,
                typeNotification: req.body.typeNotification,
            }
        } else {
            res.json({
                status: 'ERROR'
            });
        }
        console.log(query);
        var oldTypeNotification = 0;
        User.findOne({
                "_id": query._id,
                "accessToken": query.accessToken
            },
            function (errFind, rsFind) {
                if (errFind) {
                    console.log('Error', errFind);
                    res.status(400).send();
                } else {
                    if (!!rsFind) {
                        console.log('Find', rsFind);
                        oldTypeNotification = rsFind.typeNotification;
                        console.log('Cu', oldTypeNotification, 'Moi', oldTypeNotification);
                        if (oldTypeNotification == query.typeNotification) {
                            console.log('Lap gia, thoat');
                            res.json({
                                status: 'OK'
                            });
                        } else {
                            console.log('Di tiep');
                            User.update({
                                    "_id": query._id,
                                    "accessToken": query.accessToken
                                }, {
                                    $set: {
                                        "typeNotification": query.typeNotification
                                    }
                                },
                                function (errSet, rsSet) {
                                    if (errSet) {
                                        console.log('Error', errSet);
                                        res.status(400).send();
                                    } else {
                                        console.log('Update', rsSet);
                                        res.json({
                                            status: 'OK'
                                        });
                                    }
                                }
                            );
                        }
                    }
                }
            }
        );

    } catch (err) {
        console.log(err);
    }
};

exports.setPrice = function (req, res) {
    console.log();
    try {
        var query = {};
        if (!!req.body._id && !!req.body.accessToken && !!req.body.price && !!req.body.playerId) {
            query = {
                _id: req.body._id,
                accessToken: req.body.accessToken,
                price: req.body.price,
                playerId: req.body.playerId
            }
        } else {
            res.json({
                status: 'ERROR'
            });
        }
        console.log(req.body._id);
        console.log(req.body.accessToken);
        console.log(req.body.price);
        console.log(req.body.playerId);
        var oldPrice = 0;
        User.findOne({
                "_id": query._id,
                "accessToken": query.accessToken
            },
            function (errFind, rsFind) {
                if (errFind) {
                    console.log('Error', errFind);
                    res.status(400).send();
                } else {
                    if (!!rsFind) {
                        console.log('Find', rsFind);
                        console.log('Find', rsFind.price);
                        oldPrice = rsFind.price;
                        console.log('Cu', oldPrice, 'Moi', req.body.price);
                        if (oldPrice == req.body.price) {
                            console.log('Lap gia, thoat');
                            res.json({
                                status: 'OK'
                            });
                        } else {
                            console.log('Di tiep');
                            Price.findOneAndUpdate({
                                    "_id": req.body.price
                                }, {
                                    $push: {
                                        "platform": {
                                            "userId": req.body._id,
                                            "playerId": req.body.playerId
                                        }
                                    }
                                }, {
                                    upsert: true,
                                    new: true
                                },
                                function (errPush, rsPush) {
                                    if (errPush) {
                                        console.log('Error', errPush);
                                        res.status(400).send();
                                    } else {
                                        console.log('Pull', rsPush);
                                        Price.findOneAndUpdate({
                                                "_id": oldPrice
                                            }, {
                                                $pull: {
                                                    "platform": {
                                                        "userId": req.body._id + ""
                                                    }
                                                }
                                            }, {
                                                new: true
                                            },
                                            function (errPull, rsPull) {
                                                if (errPull) {
                                                    console.log('Error', errPull);
                                                    res.status(400).send();
                                                } else {
                                                    console.log('Push', rsPull);
                                                    User.update({
                                                            "_id": query._id,
                                                            "accessToken": query.accessToken
                                                        }, {
                                                            $set: {
                                                                "price": req.body.price
                                                            }
                                                        },
                                                        function (errSet, rsSet) {
                                                            if (errSet) {
                                                                console.log('Error', errSet);
                                                                res.status(400).send();
                                                            } else {
                                                                console.log('Update', rsSet);
                                                                res.json({
                                                                    status: 'OK'
                                                                });
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                }
            }
        );

    } catch (err) {
        console.log(err);
    }
};



exports.setAddress = function (req, res) {
    try {
        var query = {};
        var locationTemp = {};
        var location = {};
        console.log('Body:', req.body);
        if (!!req.body._id && !!req.body.accessToken && !!req.body.location && !!req.body.address && !!req.body.playerId) {
            query = {
                _id: req.body._id,
                accessToken: req.body.accessToken,
                location: req.body.location,
                address: req.body.address,
                playerId: req.body.playerId
            }
            locationTemp = req.body.location;
            location.latDu = locationTemp.lat % 0.02;
            location.latNguyen = locationTemp.lat - location.latDu;
            location.lngDu = locationTemp.lng % 0.02;
            location.lngNguyen = locationTemp.lng - location.lngDu;
            console.log(location.latNguyen, location.latDu, location.lngNguyen, location.lngDu);
            console.log(locationTemp);
        } else {
            res.json({
                status: 'ERROR'
            });
        }
        console.log(req.body._id);
        console.log(req.body.accessToken);
        var oldLocation = {};
        User.findOne({
                "_id": query._id,
                "accessToken": query.accessToken
            },
            function (errFind, rsFind) {
                if (errFind) {
                    console.log('Error', errFind);
                    res.status(400).send();
                } else {
                    if (!!rsFind) {
                        console.log('Find', rsFind);
                        console.log('Find', rsFind.location);
                        oldLocation.lat = rsFind.location.lat;
                        oldLocation.lng = rsFind.location.lng;
                        var oldLocationCalc = {};
                        oldLocationCalc.latDu = oldLocation.lat % 0.02;
                        oldLocationCalc.latNguyen = oldLocation.lat - oldLocationCalc.latDu;
                        oldLocationCalc.lngDu = oldLocation.lng % 0.02;
                        oldLocationCalc.lngNguyen = oldLocation.lng - oldLocationCalc.lngDu;
                        console.log('Cu', oldLocation, 'Moi', req.body.location);
                        if (oldLocation.lat == req.body.location.lat && oldLocation.lng == req.body.location.lng) {
                            console.log('Lap gia, thoat');
                            res.json({
                                status: 'OK'
                            });
                        } else {
                            console.log('Di tiep');
                            Location.findOneAndUpdate({
                                    "lat": location.latNguyen,
                                    "lng": location.lngNguyen
                                }, {
                                    $push: {
                                        "platform": {
                                            "userId": req.body._id,
                                            "playerId": req.body.playerId
                                        }
                                    }
                                }, {
                                    upsert: true,
                                    new: true
                                },
                                function (errPush, rsPush) {
                                    if (errPush) {
                                        console.log('Error', errPush);
                                        res.status(400).send();
                                    } else {
                                        console.log('Pull', rsPush);
                                        Location.findOneAndUpdate({
                                                "lat": oldLocationCalc.latNguyen,
                                                "lng": oldLocationCalc.lngNguyen
                                            }, {
                                                $pull: {
                                                    "platform": {
                                                        "userId": req.body._id
                                                    }
                                                }
                                            }, {
                                                new: true
                                            },
                                            function (errPull, rsPull) {
                                                if (errPull) {
                                                    console.log('Error', errPull);
                                                    res.status(400).send();
                                                } else {
                                                    console.log('Push', rsPull);
                                                    User.update({
                                                            "_id": query._id,
                                                            "accessToken": query.accessToken
                                                        }, {
                                                            $set: {
                                                                "address": req.body.address,
                                                                "location": req.body.location
                                                            }
                                                        },
                                                        function (errSet, rsSet) {
                                                            if (errSet) {
                                                                console.log('Error', errSet);
                                                                res.status(400).send();
                                                            } else {
                                                                console.log('Update', rsSet);
                                                                res.json({
                                                                    status: 'OK'
                                                                });
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                }
            }
        );

    } catch (err) {
        console.log(err);
    }
};


exports.get = function (req, res) {
    try {
        var lastPostId = req.body.lastPostId || "0";
        console.log('Last post id of feeds: ', lastPostId);
        console.log('Number of feeds: ', NUMOFPOST);
        oid = mongoose.Types.ObjectId(lastPostId)
        console.log(mongoose.Types.ObjectId.isValid(lastPostId));

        User.find({
            _id: {
                $gt: oid
            }
        }).limit(100).sort({
            "_id": -1
        }).exec(function (err, result) {
            if (err) console.log('Error', err);
            res.json(result);
        });

    } catch (err) {
        console.log(err);
    }
};
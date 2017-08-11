/**
 * Created by baohq on 7/28/16.
 */
var Config = require('../config/config'),
    SORTBY = 'created_time',
    User = require('mongoose').model('User'),
    Price = require('mongoose').model('Price'),
    Location = require('mongoose').model('Location'),
    All = require('mongoose').model('All'),
    PriceAndLocation = require('mongoose').model('PriceAndLocation'),
    Notification = require('mongoose').model('Notification'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
    dateTime = require('node-datetime');

function updateUser(query, data, callback) {
    User.findOneAndUpdate(query, {
            $set: data
        },
        function (errSet, rsSet) {
            if (errSet) {
                console.log('Error', errSet);
                res.status(400).send();
            } else {
                if (callback) callback(rsSet);
            }
        }
    );
}

function findUser(query, callback) {
    User.findOne(query,
        function (errFind, rsFind) {
            if (errFind) {
                console.log('Error', errFind);
                res.status(400).send();
            } else {
                if (callback) callback(rsFind);
            }
        });
}

function pushPrice(query, data, callback) {
    Price.findOneAndUpdate(query, {
            $push: data
        }, {
            upsert: true,
            new: true
        },
        function (errPush, rsPush) {
            if (errPush) {
                console.log('Error', errPush);
                res.status(400).send();
            } else {
                if (callback) callback(rsPush);
            }
        }
    );
}

function pushLocation(query, data, callback) {
    Location.findOneAndUpdate(query, {
            $push: data
        }, {
            upsert: true,
            new: true
        },
        function (errPush, rsPush) {
            if (errPush) {
                console.log('Error', errPush);
                res.status(400).send();
            } else {
                if (callback) callback(rsPush);
            }
        }
    );
}

function pushPriceAndLocation(query, data, callback) {
    PriceAndLocation.findOneAndUpdate(query, {
            $push: data
        }, {
            upsert: true,
            new: true
        },
        function (errPush, rsPush) {
            if (errPush) {
                console.log('Error', errPush);
                res.status(400).send();
            } else {
                if (callback) callback(rsPush);
            }
        }
    );
}

function pushAll(data, callback) {
    var all = new All(data);
    all.save(function (errPush, rsPush) {
        if (errPush) {
            console.log('Error', errPush);
            res.status(400).send();
        } else {
            if (callback) callback(rsPush);
        }
    });
}

function pullPrice(query, data, callback) {
    Price.findOneAndUpdate(query, {
            $pull: data
        }, {
            new: true
        },
        function (errPull, rsPull) {
            if (errPull) {
                console.log('Error', errPull);
                res.status(400).send();
            } else {
                if (callback) callback(rsPull);
            }
        }
    );
}

function pullLocation(query, data, callback) {
    Location.findOneAndUpdate(query, {
            $pull: data
        }, {
            new: true
        },
        function (errPull, rsPull) {
            if (errPull) {
                console.log('Error', rsPull);
                res.status(400).send();
            } else {
                if (callback) callback(rsPull);
            }
        }
    );
}

function pullPriceAndLocation(query, data, callback) {
    PriceAndLocation.findOneAndUpdate(query, {
            $pull: data
        }, {
            new: true
        },
        function (errPull, rsPull) {
            if (errPull) {
                console.log('Error', rsPull);
                res.status(400).send();
            } else {
                if (callback) callback(rsPull);
            }
        }
    );
}

function pullAll(query, callback) {
    All.remove(query,
        function (errPull, rsPull) {
            if (errPull) {
                console.log('Error', rsPull);
                res.status(400).send();
            } else {
                if (callback) callback(rsPull);
            }
        }
    );
}
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
                typeNotification: 1
            }
        } else {
            res.json({
                status: 'ERROR'
            });
        }
        console.log(queryUpdate);
        console.log(queryNew);
        findUser({
                "_id": queryUpdate._id,
            },
            function (rsFind) {
                if (!!rsFind) {
                    updateUser({
                            "_id": queryUpdate._id,
                        }, {
                            "accessToken": queryUpdate.accessToken,
                            "logged_time": queryUpdate.logged_time,
                            "playerId": queryUpdate.playerId
                        },
                        function (rsSet) {
                            console.log('Update', rsSet);
                            res.json(rsSet);
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
        var location = {};
        var userInfo;
        findUser({
            "_id": query._id,
            "accessToken": query.accessToken
        }, function (rsFind) {
            if (!!rsFind) {
                userInfo = rsFind;
                console.log('Find', rsFind);
                oldTypeNotification = rsFind.typeNotification;
                location.lat = rsFind.location.lat;
                location.lng = rsFind.location.lng;
                var locationCalc = {};
                locationCalc.latDu = location.lat % 0.02;
                locationCalc.latNguyen = location.lat - locationCalc.latDu;
                locationCalc.lngDu = location.lng % 0.02;
                locationCalc.lngNguyen = location.lng - locationCalc.lngDu;
                console.log('Location', location, 'Price', userInfo.price);
                if (oldTypeNotification == query.typeNotification) {
                    console.log('Lap type notification, thoat');
                    res.json({
                        status: 'OK'
                    });
                } else {
                    console.log('Di tiep');
                    updateUser({
                        "_id": query._id,
                        "accessToken": query.accessToken
                    }, {
                        "typeNotification": query.typeNotification
                    }, function (rsUpdateUser) {
                        console.log('Update', rsUpdateUser);
                        if (query.typeNotification == 5) {
                            // Notification by price and location
                            if (userInfo.price != 0 && !!userInfo.location.lat == true) {
                                // Push price and location to mongo
                                pushPriceAndLocation({
                                    "lat": locationCalc.latNguyen,
                                    "lng": locationCalc.lngNguyen,
                                    "price": userInfo.price
                                }, {
                                    "platform": {
                                        "userId": userInfo._id,
                                        "playerId": userInfo.playerId
                                    }
                                }, function (resPushPriceAndLocation) {
                                    console.log(resPushPriceAndLocation);
                                    // Pull localtion
                                    pullLocation({
                                        "lat": locationCalc.latNguyen,
                                        "lng": locationCalc.lngNguyen
                                    }, {
                                        "platform": {
                                            "userId": userInfo._id + ""
                                        }
                                    }, function (resPullLocation) {
                                        console.log(resPullLocation);
                                        // Pull price
                                        pullPrice({
                                            "_id": userInfo.price
                                        }, {
                                            "platform": {
                                                "userId": userInfo._id + ""
                                            }
                                        }, function (resPullPrice) {
                                            console.log(resPullPrice);
                                            // Pull all
                                            pullAll({
                                                "_id": userInfo._id,
                                                "playerId": userInfo.playerId
                                            }, function (resPullAll) {
                                                console.log(resPullAll);
                                            });
                                        });
                                    });
                                });
                            }
                        } else if (query.typeNotification == 4) {
                            // Notification by price
                            console.log('Chuan bi push price');
                            if (userInfo.price != 0) {
                                // Push price
                                pushPrice({
                                    "_id": userInfo.price
                                }, {
                                    "platform": {
                                        "userId": userInfo._id,
                                        "playerId": userInfo.playerId
                                    }
                                }, function (resPushPrice) {
                                    console.log('Push price ok');
                                    console.log(resPushPrice);
                                    // Pull localtion
                                    pullLocation({
                                        "lat": locationCalc.latNguyen,
                                        "lng": locationCalc.lngNguyen
                                    }, {
                                        "platform": {
                                            "userId": userInfo._id + ""
                                        }
                                    }, function (resPullLocation) {
                                        console.log(resPullLocation);
                                        // Pull price and location
                                        pullPriceAndLocation({
                                            "price": userInfo.price,
                                            "lat": locationCalc.latNguyen,
                                            "lng": locationCalc.lngNguyen
                                        }, {
                                            "platform": {
                                                "userId": userInfo._id + ""
                                            }
                                        }, function (resPullPriceAndLocation) {
                                            console.log(resPullPriceAndLocation);
                                            // Pull all
                                            pullAll({
                                                "_id": userInfo._id,
                                                "playerId": userInfo.playerId
                                            }, function (resPullAll) {
                                                console.log(resPullAll);
                                            });
                                        });
                                    });
                                });
                            }
                        } else if (query.typeNotification == 3) {
                            // Notification by location
                            if (!!userInfo.location.lat == true) {
                                // Push location
                                console.log('Chuan bi push location');
                                pushLocation({
                                    "lat": locationCalc.latNguyen,
                                    "lng": locationCalc.lngNguyen
                                }, {
                                    "platform": {
                                        "userId": userInfo._id,
                                        "playerId": userInfo.playerId
                                    }
                                }, function (resPushLocation) {
                                    console.log(resPushLocation);
                                    console.log('Chuan bi pull price');
                                    // Pull price
                                    pullPrice({
                                        "_id": userInfo.price
                                    }, {
                                        "platform": {
                                            "userId": userInfo._id + ""
                                        }
                                    }, function (resPullPrice) {
                                        console.log(resPullPrice);
                                        // Pull price and localtion
                                        console.log('Chuan bi pull price and location');
                                        pullPriceAndLocation({
                                            "price": userInfo.price,
                                            "lat": locationCalc.latNguyen,
                                            "lng": locationCalc.lngNguyen
                                        }, {
                                            "platform": {
                                                "userId": userInfo._id + ""
                                            }
                                        }, function (resPullPriceAndLocation) {
                                            console.log(resPullPriceAndLocation);
                                            // Pull all
                                            pullAll({
                                                "_id": userInfo._id,
                                                "playerId": userInfo.playerId
                                            }, function (resPullAll) {
                                                console.log(resPullAll);
                                            });
                                        });
                                    });
                                });
                            }
                        } else if (query.typeNotification == 2) {
                            // Notification by all
                            // Push all
                            console.log('Chuan bi push all');
                            pushAll({
                                "_id": userInfo._id,
                                "playerId": userInfo.playerId
                            }, function (resPushAll) {
                                console.log('Rs push all', resPushAll);
                                // Pull price
                                pullPrice({
                                    "_id": userInfo.price
                                }, {
                                    "platform": {
                                        "userId": userInfo._id + ""
                                    }
                                }, function (resPullPrice) {
                                    console.log(resPullPrice);
                                    // Pull localtion
                                    pullLocation({
                                        "lat": locationCalc.latNguyen,
                                        "lng": locationCalc.lngNguyen
                                    }, {
                                        "platform": {
                                            "userId": userInfo._id,
                                            "playerId": userInfo.playerId
                                        }
                                    }, function (resPullLocation) {
                                        console.log(resPullLocation);
                                        // Pull price and localtion
                                        pullPriceAndLocation({
                                            "price": userInfo.price,
                                            "lat": locationCalc.latNguyen,
                                            "lng": locationCalc.lngNguyen
                                        }, {
                                            "platform": {
                                                "userId": userInfo._id + ""
                                            }
                                        }, function (resPullPriceAndLocation) {
                                            console.log(resPullPriceAndLocation);
                                        });
                                    });
                                });
                            });
                        } else if (query.typeNotification == 1) {
                            // Notification is off
                            // Pull all
                            console.log('Chuan bi pull all');
                            pullAll({
                                "_id": userInfo._id,
                                "playerId": userInfo.playerId
                            }, function (resPullAll) {
                                console.log(resPullAll);
                                // Pull price
                                console.log('Chuan bi pull price');
                                pullPrice({
                                    "price": userInfo.price
                                }, {
                                    "platform": {
                                        "userId": userInfo._id + ""
                                    }
                                }, function (resPullPrice) {
                                    console.log(resPullPrice);
                                    // Pull localtion
                                    console.log('Chuan bi pull localtion');
                                    pullLocation({
                                        "lat": locationCalc.latNguyen,
                                        "lng": locationCalc.lngNguyen
                                    }, {
                                        "platform": {
                                            "userId": userInfo._id,
                                            "playerId": userInfo.playerId
                                        }
                                    }, function (resPushLocation) {
                                        console.log(resPushLocation);
                                        // Pull price and localtion
                                        console.log('Chuan bi pull price and location');
                                        pullPriceAndLocation({
                                            "price": userInfo.price,
                                            "lat": locationCalc.latNguyen,
                                            "lng": locationCalc.lngNguyen
                                        }, {
                                            "platform": {
                                                "userId": userInfo._id + ""
                                            }
                                        }, function (resPullPriceAndLocation) {
                                            console.log(resPullPriceAndLocation);
                                        });
                                    });
                                });
                            });
                        }
                        res.json({
                            status: 'OK'
                        });

                    });
                }
            }
        });

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
        console.log(query);
        var oldPrice = 0;
        var oldLocation = {};
        findUser({
                "_id": query._id,
                "accessToken": query.accessToken
            },
            function (rsFind) {
                if (!!rsFind) {
                    console.log('Find', rsFind);
                    oldPrice = rsFind.price;
                    oldLocation = rsFind.location;
                    var location = {};
                    location.latDu = oldLocation.lat % 0.02;
                    location.latNguyen = oldLocation.lat - location.latDu;
                    location.lngDu = oldLocation.lng % 0.02;
                    location.lngNguyen = oldLocation.lng - location.lngDu;
                    console.log(location.latNguyen, location.latDu, location.lngNguyen, location.lngDu);
                    console.log('Cu', oldPrice, 'Moi', req.body.price);
                    if (oldPrice == req.body.price) {
                        console.log('Gia giu nguyen, thoat');
                        res.json({
                            status: 'OK'
                        });
                    } else {
                        console.log('Thay doi gia');
                        if (rsFind.typeNotification == 4) {
                            pushPrice({
                                    "_id": query.price
                                }, {
                                    "platform": {
                                        "userId": query._id,
                                        "playerId": query.playerId
                                    }
                                },
                                function (rsPush) {
                                    console.log('Pull', rsPush);
                                }
                            );
                        } else if (rsFind.typeNotification == 5 && !!oldLocation.lat) {
                            pushPriceAndLocation({
                                    "lat": location.latNguyen,
                                    "lng": location.lngNguyen,
                                    "price": query.price
                                }, {
                                    "platform": {
                                        "userId": query._id,
                                        "playerId": query.playerId
                                    }
                                },
                                function (rsPush) {
                                    console.log('Pull', rsPush);
                                }
                            );
                        }
                        pullPrice({
                                "_id": oldPrice
                            }, {
                                "platform": {
                                    "userId": req.body._id + ""
                                }
                            },
                            function (rsPull) {
                                console.log('Push', rsPull);
                                pullPriceAndLocation({
                                        "lat": location.latNguyen,
                                        "lng": location.lngNguyen,
                                        "price": oldPrice
                                    }, {
                                        "platform": {
                                            "userId": req.body._id + ""
                                        }
                                    },
                                    function (rsPull) {
                                        console.log('Push', rsPull);
                                    }
                                );
                            }
                        );
                        updateUser({
                                "_id": query._id,
                                "accessToken": query.accessToken
                            }, {
                                "price": query.price
                            },
                            function (errSet, rsSet) {
                                console.log('Update', rsSet);
                                res.json({
                                    status: 'OK'
                                });
                            }
                        );
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
        console.log(query);
        var oldLocation = {};
        var oldPrice = 0;
        findUser({
                "_id": query._id,
                "accessToken": query.accessToken
            },
            function (rsFind) {
                if (!!rsFind) {
                    console.log('Find', rsFind);
                    oldPrice = rsFind.price;
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
                        if (rsFind.typeNotification == 3) {
                            pushLocation({
                                    "lat": location.latNguyen,
                                    "lng": location.lngNguyen
                                }, {
                                    "platform": {
                                        "userId": req.body._id,
                                        "playerId": req.body.playerId
                                    }
                                },
                                function (rsPush) {
                                    console.log('Pull', rsPush);
                                }
                            );
                        } else if (rsFind.typeNotification == 5 && oldPrice != 0) {
                            pushPriceAndLocation({
                                    "lat": location.latNguyen,
                                    "lng": location.lngNguyen,
                                    "price": oldPrice
                                }, {
                                    "platform": {
                                        "userId": query._id,
                                        "playerId": query.playerId
                                    }
                                },
                                function (rsPush) {
                                    console.log('Pull', rsPush);
                                }
                            );
                        }

                        pullLocation({
                                "lat": oldLocationCalc.latNguyen,
                                "lng": oldLocationCalc.lngNguyen
                            }, {
                                "platform": {
                                    "userId": req.body._id + ""
                                }
                            },
                            function (rsPull) {
                                console.log('Push', rsPull);
                                pullPriceAndLocation({
                                        "lat": location.latNguyen,
                                        "lng": location.lngNguyen,
                                        "price": oldPrice
                                    }, {
                                        "platform": {
                                            "userId": req.body._id + ""
                                        }
                                    },
                                    function (rsPull) {
                                        console.log('Push', rsPull);
                                    }
                                );
                            }
                        );
                        updateUser({
                                "_id": query._id,
                                "accessToken": query.accessToken
                            }, {
                                "address": req.body.address,
                                "location": req.body.location
                            },
                            function (rsSet) {
                                console.log('Update', rsSet);
                                res.json({
                                    status: 'OK'
                                });
                            }
                        );
                    }
                }
            }
        );

    } catch (err) {
        console.log(err);
    }
};

exports.getNotifications = function (req, res) {
    try {
        var query = {};
        console.log('Body:', req.body);
        if (!!req.body._id && !!req.body.accessToken) {
            query = {
                _id: req.body._id,
                accessToken: req.body.accessToken
            }
        } else {
            res.json({
                status: 'ERROR'
            });
        }
        console.log(query);
        var oldLocation = {};
        var oldPrice = 0;

        Notification.find({
            'userId': query._id + ''
        }).limit(100).sort({
            "created_time": -1
        }).exec(function (err, result) {
            if (err) console.log('Error', err);
            res.json(result);
        });
    } catch (err) {
        console.log(err);
    }
};
exports.viewNotification = function (req, res) {
    try {
        var query = {};
        console.log('Body:', req.body);
        if (!!req.body._id && !!req.body.accessToken && !! req.body.notificationId) {
            query = {
                _id: req.body._id,
                accessToken: req.body.accessToken,
                notificationId: req.body.notificationId
            }
            console.log(query);
            var oldLocation = {};
            var oldPrice = 0;
            var notificationId = mongoose.Types.ObjectId(query.notificationId);
            console.log(query.notificationId, mongoose.Types.ObjectId.isValid(query.notificationId), notificationId);

            Notification.findOneAndUpdate({
                "_id": mongoose.Types.ObjectId(query.notificationId)
            }, {
                $set: {
                    "read": 1
                }
            }, function (err, result) {
                console.log('Error', err);
                if (err) console.log('Error', err);
                else{
                    console.log(result);
                    res.json({status: 'OK'});
                }
            });
        } else {
            res.json({
                status: 'ERROR'
            });
        }
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
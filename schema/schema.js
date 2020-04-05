"use strict";

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLFloat,
    GraphQLInt
} = require("graphql");

const connection = require("../models/connection.js");
const connectionType = require("../models/connectionTypes.js");
const currentType = require("../models/currentType.js");
const level = require("../models/levels.js");
const station = require("../models/station.js");

const stationGT = new GraphQLObjectType({
    name: "station",
    description: "Station info",
    fields: () => ({
        Title: { type: GraphQLString },
        AddressLine1: { type: GraphQLString },
        Town: { type: GraphQLString },
        StateOrProvince: { type: GraphQLString },
        Postcode: { type: GraphQLString },
        Connections: {
            type: connectionGT,
            resolve: async (parent, args) => {
                try {
                    return await connection.findById(parent.Connections);
                } catch (error) {
                    return new Error(error.message);
                }
            }
        },
        Location: {
            type: new GraphQLObjectType({
                name: "location",
                fields: () => ({
                    type: { type: GraphQLString },
                    coordinates: { type: new GraphQLList(GraphQLFloat) }
                })
            })
        }
    })
});

const connectionGT = new GraphQLObjectType({
    name: "connections",
    description: "List of the stations connections",
    fields: () => ({
        ConnectionTypeID: {
            type: connectionTypeGT,
            resolve: async (parent, args) => {
                try {
                    return await connectionType.findById(parent.ConnectionTypeID);
                } catch (error) {
                    return new Error(error.message);
                }
            }
        },
        LevelID: {
            type: levelGT,
            resolve: async (parent, args) => {
                try {
                    return await level.findById(parent.LevelID);
                } catch (error) {
                    return new Error(error.message);
                }
            }
        },
        CurrentTypeID: {
            type: currentTypeGT,
            resolve: async (parent, args) => {
                try {
                    return await currentType.findById(parent.CurrentTypeID);
                } catch (error) {
                    return new Error(error.message);
                }
            }
        },
        Quantity: { type: GraphQLString }
    })
});

const connectionTypeGT = new GraphQLObjectType({
    name: "connectiontype",
    description: "Describes the connection type",
    fields: () => ({
        id: { type: GraphQLID },
        FormalName: { type: GraphQLString },
        Title: { type: GraphQLString }
    })
});

const connectionTypeGTInput = new GraphQLInputObjectType({
    name: "connectiontypeinput",
    description: "defines connection type input",
    fields: () => ({
        id: { type: GraphQLID },
        FormalName: { type: GraphQLString },
        Title: { type: GraphQLString }
    })
});

const levelGT = new GraphQLObjectType({
    name: "level",
    description: "Describes the connection level",
    fields: () => ({
        id: { type: GraphQLID },
        Comments: { type: GraphQLString },
        IsFastChargeCapable: { type: GraphQLBoolean },
        Title: { type: GraphQLString }
    })
});

const levelGTInput = new GraphQLInputObjectType({
    name: "levelinput",
    description: "defines level input",
    fields: () => ({
        id: { type: GraphQLID },
        Comments: { type: GraphQLString },
        IsFastChargeCapable: { type: GraphQLBoolean },
        Title: { type: GraphQLString }
    })
});

const currentTypeGT = new GraphQLObjectType({
    name: "currenttype",
    description: "Describes the current type",
    fields: () => ({
        id: { type: GraphQLID },
        Description: { type: GraphQLString },
        Title: { type: GraphQLString }
    })
});

const currentTypeGTInput = new GraphQLInputObjectType({
    name: "currenttypeinput",
    description: "defines current type input",
    fields: () => ({
        id: { type: GraphQLID },
        Description: { type: GraphQLString },
        Title: { type: GraphQLString }
    })
});

const connectionInputGT = new GraphQLInputObjectType({
    name: "connectionsinput",
    description: "defines connection input",
    fields: () => ({
        ConnectionTypeID: { type: GraphQLID },
        CurrentTypeID: { type: GraphQLID },
        LevelID: { type: GraphQLID },
        Quantity: { type: GraphQLInt }
    })
});

const location = new GraphQLInputObjectType({
    name: "loc",
    fields: () => ({
        type: { type: GraphQLString, defaultValue: "Point" },
        coordinates: {
            type: new GraphQLList(GraphQLFloat)
        }
    })
});

const locationP = new GraphQLInputObjectType({
    name: "sWnE",
    fields: () => ({
            _southWest: {
                type: new GraphQLInputObjectType({
                    name: "sW",
                    fields: () => ({
                        lat: {type: GraphQLFloat},
                        lng: {type: GraphQLFloat}
                    })
                })
            },
            _northEast: {
                type: new GraphQLInputObjectType({
                    name: "nE",
                    fields: () => ({
                        lat: {type: GraphQLFloat},
                        lng: {type: GraphQLFloat}
                    })
                })
            },
    })
});

const Mutation = new GraphQLObjectType({
    name: "MutationType",
    description: "Mutations...",
    fields: {
        addStation: {
            type: stationGT,
            description: "Add station",
            args: {
                Connections: {
                    type: new GraphQLNonNull( new GraphQLList(connectionInputGT))
                },
                Location: {
                    type: new GraphQLNonNull(location)
                },
                Title: { type: new GraphQLNonNull(GraphQLString) },
                AddressLine1: { type: new GraphQLNonNull(GraphQLString) },
                Town: { type: new GraphQLNonNull(GraphQLString) },
                StateOrProvince: { type: new GraphQLNonNull(GraphQLString) },
                Postcode: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                try {
                    var connections = [];
                    await args.Connections.forEach(element => {
                        const newConnection = new connection(element);
                        newConnection.save();
                        connections.push(newConnection);
                    });
                    args.Connections = connections;
                    const newStation = new station(args);
                    return await newStation.save();
                } catch(e) {
                    return new Error(e);
                }
            }
        },
        modifyStation: {
            type: stationGT,
            description: "Modify an existing station",
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                Connections: {
                    type: new GraphQLList(connectionInputGT)
                },
                Location: {
                    type: new GraphQLNonNull(location)
                },
                Title: { type: GraphQLString },
                AddressLine1: { type: GraphQLString },
                Town: { type: GraphQLString },
                StateOrProvince: { type: GraphQLString },
                Postcode: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                try {
                    var connections = [];
                    await args.Connections.forEach(element => {
                        const newConnection = new connection(element);
                        newConnection.save();
                        connections.push(newConnection);
                    });
                    args.Connections = connections;
                    console.log(args.Connections);
                    return await station.findByIdAndUpdate(args.id, args, { new: true })
                } catch(e) {
                    return new Error(e);
                }
            }
        },
        deleteStation: {
            type: stationGT,
            description: "Delete a station",
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: async (parent, args) => {
                try {
                    const deletedS = await station.findByIdAndDelete(args.id);
                    return deletedS;
                } catch (error) {
                    return new Error(error);
                }
            }
        },
        deleteConnection: {
            type: connectionGT,
            description: "Delete a connection",
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: async (parent, args) => {
                try {
                    const deletedC = await connection.findByIdAndDelete(args.id);
                    return deletedC;
                } catch (error) {
                    return new Error(error);
                }
            }
        }
        }

});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        stations: {
            type: new GraphQLList(stationGT),
            description: "Get all stations",
            args: {
                limit: { type: GraphQLInt },
                start: { type: GraphQLInt },
                bounds: { type: locationP},
            },
            resolve: async (parent, args) => {
                try {
                    if (args.limit === undefined) {
                        args.limit = 10;
                    }
                    if (args.bounds !== undefined) {
                        let bounds = args.bounds;
                        let nEast = bounds._northEast;
                        let sWest = bounds._southWest;
                        return await station
                            .find(({
                                Location: {
                                    $geoWithin: {
                                        $geometry: {
                                            "type": "Polygon",
                                            "coordinates":
                                                [[
                                                    [sWest.lng, sWest.lat],
                                                    [nEast.lng, sWest.lat],
                                                    [nEast.lng, nEast.lat],
                                                    [sWest.lng, nEast.lat],
                                                    [sWest.lng, sWest.lat]

                                                ]]

                                        }
                                    }
                                }
                            }))
                            .limit(Number.parseInt(args.limit))
                            .skip(Number.parseInt(args.start));
                    }
                    else {
                        return await station
                            .find()
                            .limit(Number.parseInt(args.limit))
                            .skip(Number.parseInt(args.start));
                    }
                }catch(e){
                    console.log(e)
                }

            }
        },
        station: {
            type: stationGT,
            description: "Get station by id",
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (parent, args) => {
                return await station.findById(args.id);
            }
        },
        connectiontypes: {
            type: new GraphQLList(connectionTypeGT),
            description: "Get connection types",
            resolve: async (parent, args) => {
                return await connectionType.find();
            }
        },
        currenttypes: {
            type: new GraphQLList(currentTypeGT),
            description: "Get current types",
            resolve: async (parent, args) => {
                return await currentType.find();
            }
        },
        leveltypes: {
            type: new GraphQLList(levelGT),
            description: "Get current types",
            resolve: async (parent, args) => {
                return await level.find();
            }
        }
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
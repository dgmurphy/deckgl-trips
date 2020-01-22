// Input Data File Names
const DATA_DIR="./data/";
const DataFiles=[
    DATA_DIR + "stps.json",
];

const EntityFile = DATA_DIR + "entity_locations.json"
const HitMessageFile = DATA_DIR + "hitmessages.json"
const FiringMessageFile = DATA_DIR + "firingmessages.json"
const DetonationsMessageFile = DATA_DIR + "detonationmessages.json"
const ImpactsMessageFile = DATA_DIR + "impactmessages.json"
const EllipseMessageFile = DATA_DIR + "impactellipses.json"
const TrackingMessageFile = DATA_DIR + "trips.json"
export { DataFiles, EntityFile, HitMessageFile, 
         FiringMessageFile, DetonationsMessageFile, 
         ImpactsMessageFile, EllipseMessageFile,
         TrackingMessageFile};
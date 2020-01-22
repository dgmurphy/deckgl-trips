import React, { Component } from 'react'


class InfoBox extends Component {

    constructor(props) {

        super(props);
        this.previousInfoHtml = ""
    }


    getMinute() {

        if (!this.props.eventInfo.object) {
            return "";
        }
        let myMinute = Date.parse(this.props.eventInfo.object.actual_time);
        myMinute = ((myMinute - this.props.startMillis)/1000.0)/60.0;
        return myMinute.toFixed(2);
    }


    getImpactMessageInfo() {

        let imObject = this.props.eventInfo.object;

        let infoHtml = <div className="info-html">
            <p><span className='entity-info-title'>Impact</span></p>
            <p>Actual Time: <span className='values'>{imObject.actual_time}</span></p>
            <p>Minutes from start: <span className='values'>{this.getMinute()}</span></p>
            <p>Message ID: <span className='values'>{this.truncateInfo(imObject.message_id, 27)}</span></p>
            <p>Detonations: <span className='values'>{imObject.num_detonations}</span></p>
            </div>

        return infoHtml

    }


    getDetonationMessageInfo() {

        let dmObject = this.props.eventInfo.object;

        let infoHtml = <div className="info-html">
            <p><span className='entity-info-title'>Detonation Message</span></p>
            <p>Actual Time: <span className='values'>{dmObject.actual_time}</span></p>
            <p>Minutes from start: <span className='values'>{this.getMinute()}</span></p>
            <p>Munition: <span className='values'>{dmObject.munition}</span></p>
            <p>Shooter ID: <span className='values'>{this.truncateInfo(dmObject.shooter_id, 27)}</span></p>
            <p>Detonation Circle Distance: <span className='values'>{dmObject.distance}</span></p>
            <p>Detonation Lat: <span className='values'>{this.truncateInfo(dmObject.coordinates[1], 29)}</span></p>
            <p>Detonation Long: <span className='values'>{this.truncateInfo(dmObject.coordinates[0], 29)}</span></p>
            <p>Message ID: <span className='values'>{this.truncateInfo(dmObject.message_id, 27)}</span></p>
            </div>

        return infoHtml

    }

    getFireMessageInfo() {
        
        let fmObject = this.props.eventInfo.object;

        let infoHtml = <div className="info-html">
            <p><span className='entity-info-title'>Firing Message</span></p>
            <p>Actual Time: <span className='values'>{fmObject.actual_time}</span></p>
            <p>Minutes from start: <span className='values'>{this.getMinute()}</span></p>
            <p>Firing Entity: <span className='values'>{this.truncateInfo(fmObject.entity_id, 27)}</span></p>
            <p>Firing Instr: <span className='values'>{this.truncateInfo(fmObject.instrumentation_id, 27)}</span></p>
            <p>Type: <span className='values'>{fmObject.type}</span></p>
            <p>Munition: <span className='values'>{fmObject.munition}</span></p>
            <p>Crewmembers Trigger: <span className='values'>{fmObject.crewmembers_trigger}</span></p>
            <p>Round Qty: <span className='values'>{this.truncateInfo(fmObject.roundQuantity, 25)}</span></p>
            <p>Fuze Type: <span className='values'>{this.truncateInfo(fmObject.fuzeType, 25)}</span></p>
            <p>Fuze Time: <span className='values'>{this.truncateInfo(fmObject.fuzeTime, 25)}</span></p>
            <p>Charge Type: <span className='values'>{this.truncateInfo(fmObject.chargeType, 25)}</span></p>
            <p>Charge Count: <span className='values'>{this.truncateInfo(fmObject.chargeCount, 25)}</span></p>
            <p>Detonation Dist: <span className='values'>{this.truncateInfo(fmObject.detonationDistance, 25)}</span></p>
            <p>Firing Lat: <span className='values'>{this.truncateInfo(fmObject.coordinates[1], 29)}</span></p>
            <p>Firing Long: <span className='values'>{this.truncateInfo(fmObject.coordinates[0], 29)}</span></p>
         </div>

        return infoHtml
    }
    

    getHitMessageInfo() {
        
        let hmObject = this.props.eventInfo.object;

        let infoHtml = <div className="info-html">
            <p><span className='entity-info-title'>Hit Message</span></p>
            <p>Actual Time: <span className='values'>{hmObject.actual_time}</span></p>
            <p>Minutes from start: <span className='values'>{this.getMinute()}</span></p>
            <p>Hit Type: <span className='values'>{hmObject.hit_type}</span></p>
            <p>Munition: <span className='values'>{hmObject.munition}</span></p>
            <p>Tess Shooter ID: <span className='values'>{hmObject.tess_shooter_id}</span></p>
            <p>Target ID: <span className='values'>{this.truncateInfo(hmObject.target.name, 27)}</span></p>
            <p>Target Instr: <span className='values'>{this.truncateInfo(hmObject.target.instrumentation, 25)}</span></p>
            <p>Target Lat: <span className='values'>{this.truncateInfo(hmObject.target.coordinates[1], 29)}</span></p>
            <p>Target Long: <span className='values'>{this.truncateInfo(hmObject.target.coordinates[0], 29)}</span></p>
            <p>Firing ID: <span className='values'>{this.truncateInfo(hmObject.firing.name, 27)}</span></p>
            <p>Firing Instr: <span className='values'>{this.truncateInfo(hmObject.firing.instrumentation, 25)}</span></p>
        </div>

        return infoHtml

    }

    getStpPinInfo() {

        let  pinObject = this.props.eventInfo.object;

        let infoHtml = <div className="info-html">
                <p><span className='entity-info-title'>Shooter to Target Pairing Entity</span></p>
                <p>ID: <span className='values'>{this.truncateInfo(pinObject.name, 29)}</span></p>
                <p>Latitude: <span className='values'>{pinObject.coordinates[1]}</span></p>
                <p>Longitude: <span className='values'>{pinObject.coordinates[0]}</span></p>
            </div>

        return infoHtml
    }

    truncateInfo(text, cutoff) {

        if (!text)
            return ''

        if(text.length > cutoff) 
            return text.substring(0,cutoff) + "..."
        else
            return text
    }

    getStpArcInfo() {

        let  arcObject = this.props.eventInfo.object;

        // Shorten names
        let fromName = this.truncateInfo(arcObject.from.name, 24)
        let toName = this.truncateInfo(arcObject.to.name, 24)
        let messId = this.truncateInfo(arcObject.message_id, 24)
        let firing_instr = this.truncateInfo(arcObject.firing_instrumentation, 24)
        let target_instr = this.truncateInfo(arcObject.target_instrumentation, 24)
        let munition = this.truncateInfo(arcObject.munition, 20)

        let infoHtml = <div className="info-html">
            <p><span className='entity-info-title'>Shooter to Target Pairing Arc</span></p>
            <p>Actual Time: <span className='values'>{arcObject.actual_time}</span></p>
            <p>Minutes from start: <span className='values'>{this.getMinute()}</span></p>
            <p>Firing Entity: <span className='values'>{fromName}</span></p>
            <p>Firing Instr: <span className='values'>{firing_instr}</span></p>
            <p>Target Entity: <span className='values'>{toName}</span></p>
            <p>Target Instr: <span className='values'>{target_instr}</span></p>
            <p>Munition: <span className='values'>{munition}</span></p>
            <p>Message ID: <span className='values'>{messId}</span></p>
        </div>
        
        return infoHtml
    }

    getEntityInfoType() {

        let  info = this.props.eventInfo.object;
        if (info.hasOwnProperty('from'))
            return "stp-arc";
        
        if (info.hasOwnProperty('hit_type'))
            return "hit-message";
        
        if (info.hasOwnProperty('crewmembers_trigger'))
            return "firing-message";
        
        if (info.hasOwnProperty('distance'))
            return "detonation-message";

        if (info.hasOwnProperty('contour'))
            return "impact-message";
        
        return "stp-pin";
    }

    getEntityInfoHtml() {

        // Fade out old info html on rollout
        if (this.props.eventInfo.object == null) {
            return <div className="info-html hidden">{this.previousInfoHtml}</div>;
        }
            

        let infoHtml
        let infoType = this.getEntityInfoType();
        switch (infoType) {
            case "stp-arc":
                infoHtml = this.getStpArcInfo()
                break;

            case "stp-pin":
                infoHtml = this.getStpPinInfo()
                break;

            case "hit-message":
                infoHtml = this.getHitMessageInfo()
                break;

            case "firing-message":
                infoHtml = this.getFireMessageInfo()
                break;

            case "detonation-message":
                infoHtml = this.getDetonationMessageInfo()
                break;

            case "impact-message":
                infoHtml = this.getImpactMessageInfo()
                break;
        }

        this.previousInfoHtml = infoHtml // For fadeout

        return infoHtml

    }

    render() {
        

        return (
            <div className="info-box">
                <div><p><b>Entity Info (hover): </b></p></div>
                <div className="entity-info" style={{ marginLeft: '5px' }}>
                    {this.getEntityInfoHtml()}
                </div>
            </div>
        )
    }
}


export default InfoBox;
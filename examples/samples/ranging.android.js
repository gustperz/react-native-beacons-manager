/* eslint-disable */

import Beacons  from 'react-native-beacons-manager';
import moment   from 'moment';

const TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

class beaconRangingOnly extends Component {
  // will be set as a reference to "beaconsDidRange" event:
  beaconsDidRangeEvent = null;

  state = {
    // region information
    uuid: '7b44b47b-52a1-5381-90c2-f09b6838c5d4',
    identifier: 'some id',

    rangingDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([])
  };

 componentWillMount(){
   const { identifier, uuid } = this.state;
   //
   // ONLY non component state aware here in componentWillMount
   //

   // start iBeacon detection (later will add Eddystone and Nordic Semiconductor beacons)
   Beacons.detectIBeacons();
   // Range beacons inside the region
   Beacons
   .startRangingBeaconsInRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
   .then(() => console.log('Beacons ranging started succesfully'))
   .catch(error => console.log(`Beacons ranging not started, error: ${error}`));
 }

 componentDidMount() {
   //
   // component state aware here - attach events
   //

   // Ranging: Listen for beacon changes
   this.beaconsDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
     'beaconsDidRange',
     (data) => {
       console.log('beaconsDidRange data: ', data);
       this.setState({ rangingDataSource: this.state.rangingDataSource.cloneWithRows(data.beacons) });
     }
   );
 }

 componentWillUnMount() {
   const { uuid, identifier } = this.state;
    // stop ranging beacons:
    Beacons
    .stopRangingBeaconsInRegion(region) // or like  < v1.0.7: .stopRangingBeaconsInRegion(identifier, uuid)
    .then(() => console.log('Beacons ranging stopped succesfully'))
    .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));

    // remove ranging event we registered at componentDidMount
    this.beaconsDidRangeEvent.remove();
 }

 render() {
   const { rangingDataSource } =  this.state;

   return (
     <View style={styles.container}>
       <Text style={styles.headline}>
         ranging beacons in the area:
       </Text>
       <ListView
         dataSource={ rangingDataSource }
         enableEmptySections={ true }
         renderRow={this.renderRangingRow}
       />
      </View>
   );
 }

 renderRangingRow = (rowData) => {
   return (
     <View style={styles.row}>
       <Text style={styles.smallText}>
         UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
       </Text>
       <Text style={styles.smallText}>
         Major: {rowData.major ? rowData.major : 'NA'}
       </Text>
       <Text style={styles.smallText}>
         Minor: {rowData.minor ? rowData.minor : 'NA'}
       </Text>
       <Text>
         RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
       </Text>
       <Text>
         Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
       </Text>
       <Text>
         Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
       </Text>
     </View>
   );
 }
}

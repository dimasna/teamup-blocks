import React, { useState, useEffect, useCallback } from 'react';
import { usePromise } from "promise-hook";
import PropTypes from 'prop-types';
import {
    Box,
    TablePicker,
    TablePickerSynced,
    ViewPickerSynced,
    Input,
    TextButton,
    Text,
    Label,
    Heading,
    SelectButtons,
    Select,
    Button,
    RecordCardList,
    Dialog,
    colors,
    useBase,
    useRecords,
    useGlobalConfig,
    useWatchable,
    useSynced,
    RecordCard,
    useSettingsButton,
    Loader
} from '@airtable/blocks/ui';
import moment from 'moment';

var Airtable = require('airtable');


const FeedComp = (props) => {


    const base = useBase();
    const data = props.data;
    const table = props.table;
    const recordColl = props.recordColl;
    //console.log(data[0])
    const diffDate = moment(data.fields.time).fromNow();
    const assignee = base.getCollaboratorByIdIfExists(data.assignee.id);
    const field = table.getFieldByName(data.type);
    const primaryFname = props.primaryFieldName;
    const nameTask = data.fields[primaryFname];
    const record = recordColl.getRecordByIdIfExists(data.id)

    return (

        <Box display="flex" flexDirection="row" paddingTop={2} paddingBottom={2} >
            <Box
                display="flex"

            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{ backgroundSize: "cover", backgroundImage: "url(" + `${assignee.profilePicUrl != undefined ? assignee.profilePicUrl : 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg'}` + ")" }}
                    borderRadius="circle"
                    width={35}
                    height={35}
                    overflow="hidden">

                </Box>
            </Box>
            <Box
                display="flex"
                flexWrap="wrap"
                width={250}
                paddingLeft={2}
                flexDirection="column">
                    
                <Text textColor="light">{diffDate}</Text>
                
                <Text variant="paragraph" size="large" fontWeight="normal">{assignee.name} has updated <Text as="span"  size="large" fontWeight="normal" textColor={colors.BLUE}>{data.type}</Text> in <Text as="span"  size="large" fontWeight="bold" textColor={colors.GRAY}>{nameTask}</Text> </Text>
                
                <RecordCard zIndex={10} width={250} record={record} fields={[field]}/>
            </Box>
        </Box>
    )
}

const TeamActivity = ({ table, sort, filter }) => {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const initRecord = []
    const [records, setRecords] = useState(initRecord);
    const [isRecordUpdated, setIsRecordUpdated] = useState(false);
    const [sortRecord, setSortRecord] = useState(initRecord);

    const [recordedProcess, setRecordedProcess] = useState(false);
    const api = globalConfig.get('apikey') != null?globalConfig.get('apikey'):null;

    //get record for all selected field that want to track the changes

    var baseApi = new Airtable({ apiKey: api }).base(base.id);


    const trackField = globalConfig.get('trackField');
    const tField = trackField != null ? trackField.split(" ") : "";

    const filterField = globalConfig.get('filterOpt');
    const fField = filterField != null ? filterField.split(" ") : "";

    const queryResult = table.selectRecords();
    const recordColl = useRecords(queryResult);

    const primaryFieldName = table.primaryField.name;

    //get field type single collaborator
    const singleCollabField = fField.map(sc => table.getFieldByIdIfExists(sc).type == 'singleCollaborator'?table.getFieldByIdIfExists(sc).name:null)

console.log(singleCollabField)



    useEffect(() => {

        if (records.length == 0) {
            getRecords();
            console.log('ufx getrecords')
        }

        

        const sortedRecord = sort != 'latest' ?

        [...records].sort(function(a,b){
            return moment(a.fields.time).diff(moment(b.fields.time)) ;
          })
        :
        [...records].sort(function(a,b){
            return moment(b.fields.time).diff(moment(a.fields.time));
          });

       
       
          console.log('ufx recors')
            setSortRecord(sortedRecord)


    }, [records]);

    useEffect(() => {
        if(isRecordUpdated){
            setRecords(initRecord)
            //getRecords()
            console.log('ufx isrecordupdated')
        }
    }, [isRecordUpdated])
  

    useEffect(() => {

    

        
        let sortedRecord = sort != 'latest' ?

        [...sortRecord].sort(function(a,b){
            return moment(a.fields.time).diff(moment(b.fields.time)) ;
          })
        :
        [...sortRecord].sort(function(a,b){
            return moment(b.fields.time).diff(moment(a.fields.time));
          });

          setSortRecord(sortedRecord)
          console.log('ufx sort')
          //setBtnFilter(false);

    

    }, [sort]);

        useEffect(() => {
        
                console.log(filter);
                setRecordedProcess(false)
                if(Object.keys(filter).length != 0){
                    var fRecord =[];
                    for (var prop in filter) {
                    console.log("obj." + prop + " = " + filter[prop]);
                    let singleCollField = false;
                    for (let index = 0; index < singleCollabField.length; index++) {
                        
                        if(prop == singleCollabField[index]){
                            console.log(singleCollabField[index])
                            singleCollField = true;
                            break;
                        }
                        
                    }
                    

                    if(filter[prop]!='All'){
                        if(singleCollField){
                            fRecord = fRecord.length != 0? fRecord.reduce((p,c) => (c.fields[prop].id == filter[prop] && p.push(c),p),[]):records.reduce((p,c) => (c.fields[prop].id == filter[prop] && p.push(c),p),[]);
                        }else{
                            fRecord = fRecord.length != 0? fRecord.reduce((p,c) => (c.fields[prop] == filter[prop] && p.push(c),p),[]):records.reduce((p,c) => (c.fields[prop] == filter[prop] && p.push(c),p),[]);
                        }
                      
                    }
                    else{
                        fRecord = fRecord.length != 0? fRecord.reduce((p,c) => (c.fields[prop] != null  && p.push(c),p),[]):records.reduce((p,c) => (c.fields[prop] != null && p.push(c),p),[]);
                    }
                }
                //console.log(fRecord)
                const sortedRecord = sort != 'latest' ?

            [...fRecord].sort(function(a,b){
                return moment(a.fields.time).diff(moment(b.fields.time)) ;
              })
            :
            [...fRecord].sort(function(a,b){
                return moment(b.fields.time).diff(moment(a.fields.time));
              });

           
           
            
                setSortRecord(sortedRecord)
                setRecordedProcess(true)
                console.log('ufx filter')
            //setSortRecord(fRecord);
            fRecord=[]
          
        }
        
   
        
    }
, [filter])
  



    useWatchable(queryResult, 'cellValues', () => {
        //getRecords();
        setRecordedProcess(false);
        setIsRecordUpdated(true)

    });


    function getRecords () {
        console.log('getrecord')

        tField != "" ? tField.forEach((tf, i) => {

            const fieldModById = globalConfig.get('modBy_' + tf);
            const fieldModTimeId = globalConfig.get('modTime_' + tf);
            const getModByField = table.getFieldByIdIfExists(fieldModById);
            const getTimeByField = table.getFieldByIdIfExists(fieldModTimeId);
            const getNameModByField = getModByField.name;
            const getNameTimeByField = getTimeByField.name;
            const getFieldName = table.getFieldByIdIfExists(tf).name;

            const filterFieldId = fField.map(ff => ff);
            //console.log(filterFieldId)           
            console.log('tfield loop')

            // console.log(getNameModByField + ' ' + getNameTimeByField);

           baseApi!=null?baseApi(table.name).select({
                fields: [getNameModByField, getNameTimeByField, primaryFieldName,...filterFieldId],
                maxRecords: 100
            })
                .eachPage(function page(records, fetchNextPage) {
                    // This function (`page`) will get called for each page of records.

                    records.forEach(function (r, idx) {
                        //console.log('Retrieved', record.get('Name'));
                        //console.log(r)
                        // record.forEach( (r,idx)=>{ 
                        //console.log(r.fields[getNameTimeByField])
                        //console.log( 'lenngth :'+Object.keys(r.fields).length)
                        if (Object.keys(r.fields).length === 0) {


                            //console.log(r.id+'index ke:'+idx)
                            return
                        } else {

                            r.fields.time = r.fields[getNameTimeByField];
                            r.assignee = r.fields[getNameModByField];
                            r.type = getFieldName;
                            //recCollected.push({id: r.id,fields:r.fields,assignee:r.assignee,type:r.type})
                            setRecords(records => records.concat(r));
                        }
                        //             }
                        //             )


                    });

                    // To fetch the next page of records, call `fetchNextPage`.
                    // If there are more records, `page` will get called again.
                    // If there are no more records, `done` will get called.
                    fetchNextPage();

                }, function done(err) {
                    if (err) { console.error(err); return; }
                    
                    
                    //records.reduce((p,c) => (c.field !== "tc_001" && p.push(c),p),[]);
                    setRecordedProcess(true)
                    setIsRecordUpdated(false)

                }):null




        }

        ) : null


    }


    return (
        <Box height="auto" width="auto" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" padding={3} backgroundColor="lightGray1">
            {/* Specify which fields are shown with the `fi*/}
            {/* {records != null ? <RecordCardList records={records} /> : <p>please setting the block first</p>} */}
            {  recordedProcess ? sortRecord.map((feedData,idx) => {
                if (feedData.fields.time == undefined) {
                    return;
                } else {
                    return <FeedComp key={idx} data={feedData} recordColl={queryResult} table={table} primaryFieldName={primaryFieldName} />
                }
            }) : <Loader scale={0.5} />}
        </Box>
    );
};
TeamActivity.propTypes = {
    table: PropTypes.any.isRequired,
};
export default TeamActivity;
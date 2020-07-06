import React, { useState } from 'react';
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
    useBase,
    useRecords,
    useGlobalConfig,
    useSynced,
    useSettingsButton,
    Icon,
    colors,
    Loader
} from '@airtable/blocks/ui';
import moment from 'moment';
import { globalConfig } from '@airtable/blocks';
const DiscComp = (props) => {


    
    const data = props.data;
 
    console.log(data)
    const diffDate = moment(data.createdTime).fromNow();
    const createdBy = data.getCellValue(globalConfig.get('createdByDiscField'));
   

    return (

        <Box
        border="thick"
        backgroundColor="white"
        borderRadius="large"
        display="flex"
        flexDirection="row"
        style={{cursor:"pointer"}}
        onClick={()=>{
            props.setRecordState(props.data);
            props.setIsViewOpen(!props.isViewOpen)
        }}
        paddingTop={3}
        paddingBottom={3}
        marginBottom={2} >
            <Box
                display="flex"
                paddingLeft={3}    
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    alignSelf="center"
                    style={{ backgroundSize: "cover", backgroundImage: "url(" + `${createdBy.profilePicUrl?createdBy.profilePicUrl:'https://react.semantic-ui.com/images/avatar/small/jenny.jpg'}` + ")" }}
                    borderRadius="circle"
                    width={40}
                    height={40}
                    overflow="hidden">

                </Box>
            </Box>
            <Box
                display="flex"
                width={250}
                paddingLeft={3}
                paddingRight={3}
                flexDirection="column">
                    <Box
                    overflow="hidden"
                    style={{textOverflow:"ellipsis", whiteSpace:"nowrap"}}
                    >
                    {data.name}
                    </Box>
                 
    <Text textColor="light">posted by {createdBy.name}</Text>
                <Text textColor="light">{diffDate}</Text>
                
                
                
            </Box>
        </Box>
    )
}

const TeamDiscussion = ({ setIsAddViewOpen,isAddViewOpen,setIsViewOpen,isViewOpen,setRecordState,recordState }) => {

    const base = useBase();
    const globalConfig = useGlobalConfig();
    const discussTable = base.getTableByIdIfExists(globalConfig.get('selectedDiscTableId'));
    
    const filterOpt = globalConfig.get('filterOpt');
    const fField = filterOpt != null ? filterOpt.split(" ") : "";

    const queryResult = discussTable!=null? discussTable.selectRecords():null;
    const records = queryResult!=null?useRecords(queryResult):"";

    return (<>
        <Box height="auto" width="auto" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" padding={3} backgroundColor="lightGray1">
          
            {  globalConfig.get('selectedDiscTableId')==null || globalConfig.get('createdByDiscField')==null?<p>please choose the discussion table and last modified by field in block setting </p>:records ==""?<p>there are no discussion</p>:records ? records.map((feedData,idx) => {
                
                    return <DiscComp key={idx} data={feedData} recordColl={queryResult} setIsViewOpen={setIsViewOpen} isViewOpen={isViewOpen} recordState={recordState} setRecordState={setRecordState}/>
                
            }) : <Loader scale={0.5} />}
        </Box>
    
        <Box
    
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="thick"
            borderRadius="circle"
            role="link"
            width={45}
            height={45}
            overflow="hidden"
            position="fixed"
            bottom={2}
            right={2}
            zIndex={20}
            
            
        >
            <Button
            
    onClick={() => setIsAddViewOpen(!isAddViewOpen)}
    style={{width:'50px', height:'50px', backgroundColor:colors.ORANGE, color:"#FFFFFF"}}
    size="large"
    icon="plus"
    aria-label="Edit"
  />
        </Box>
    </>);
};
TeamDiscussion.propTypes = {
    table: PropTypes.any.isRequired,
};
export default TeamDiscussion;
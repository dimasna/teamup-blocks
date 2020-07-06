import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
    Box,
    TablePicker,
    TablePickerSynced,
    ViewPickerSynced,
    Input,
    TextButton,
    Text,
    Label,
    FieldPickerSynced,
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
    FieldPicker,
    Loader
} from '@airtable/blocks/ui';
import { Checkbox } from 'semantic-ui-react';
import { FieldType } from '@airtable/blocks/models';
import { base } from '@airtable/blocks';



const AddView = ({ setIsAddViewOpen,isAddViewOpen,setSelectedMenu }) => {
    const [titleValue, setTitleValue] = React.useState("");
    const [contentValue, setContentValue] = React.useState("");
    const [isLoad, setIsLoad] = React.useState(false);

    const base = useBase();
    const globalConfig = useGlobalConfig();
    const discussTable = base.getTableByIdIfExists(globalConfig.get('selectedDiscTableId'));

    let recordfield;

    useEffect(() => {
     recordfield = { 'title': titleValue,
     'content': contentValue}
    }, [titleValue,contentValue])

    async function createNewDiscuss(recordFields) {
        if (discussTable.hasPermissionToCreateRecord(recordFields)) {
            return await discussTable.createRecordAsync(recordFields);
        }
       
        
    }
    

    return (
        <Box
            display="flex"
            padding={3}
            flexDirection="column">
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                borderBottom="default"
                paddingBottom={3}
            >
                <Box width={30} alignSelf="flex-end"><TextButton
                    onClick={() => setIsAddViewOpen(!isAddViewOpen)}
                    variant="dark"
                    size="xlarge"
                    icon="left"
                    aria-label="Back"
                /></Box>
                <Box><Heading>Add New Topic</Heading></Box>
            </Box>
            
            <br/>
            <Box>
                <Label htmlFor="my-input">Title</Label>
                <Input
                    id="titleTopic"
                    value={titleValue}
                    style={{backgroundColor:"#ffffff",border:"solid 0.5pt"}}
                    onChange={e => setTitleValue(e.target.value)}
                />
            </Box>
            <br/>
            <Box width="auto">
                <Label htmlFor="my-input">Content</Label>
                <textarea
                    id="titleTopic"
                    value={contentValue}
                    rows="14" 
                    style={{width:"100%", maxWidth:"100%",minWidth:"100%",border:"solid 0.5pt"}}
                    onChange={e => setContentValue(e.target.value)}
                ></textarea>
            </Box>
          <br/>
            <Box width="auto">
                    <Button
            onClick={async () => {
                setIsLoad(true)
                const recordId = await createNewDiscuss(recordfield);
                if(recordId != null){
                    setIsLoad(false)
                    setSelectedMenu(1)
                    setIsAddViewOpen(!isAddViewOpen)

                }else{
                    alert('failed to add new topic')
                }
            }}
            variant={isLoad?'default':'primary'}
            size="large"
            icon={isLoad?'':'edit'}
            style={{width:"100%"}}
        >{isLoad?<Loader scale="0.3"/>:<>Post</>}</Button>
            </Box>
        </Box>
    )

};

AddView.propTypes = {
    setIsAddViewOpen: PropTypes.func.isRequired,
};

export default AddView;

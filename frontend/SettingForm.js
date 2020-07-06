import PropTypes from 'prop-types';
import React, { useState } from 'react';

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



const SettingForm = ({ setIsSettingOpen,table }) => {
    const [apiValue, setApiValue, canSetApiValue] = useSynced('apikey');
    //const [arrTrackField, setarrTrackField] = useSynced('trackFieldState');  
    const [isLoading, setIsLoading] = useState(false);

    const globalConfig = useGlobalConfig();

    let discussionTableId = globalConfig.get('selectedDiscTableId') || "";
    const discussionTable = base.getTableByIdIfExists(discussionTableId);

    let commTableId = globalConfig.get('selectedCommTableId') || "";
    const commTable = base.getTableByIdIfExists(commTableId);

    let filterOpt = globalConfig.get('filterOpt') || "";
    const addFilter = (id) => globalConfig.setAsync('filterOpt', filterOpt == "" ? id : filterOpt + ' ' + id);
    const remFilter = (id) => globalConfig.setAsync('filterOpt', filterOpt.includes(' ' + id) ? filterOpt.replace(' ' + id, '') : filterOpt.replace(id, ''));

    let trackField = globalConfig.get('trackField') || "";
    const addTrack = (id) => globalConfig.setAsync('trackField', trackField == "" ? id : trackField + ' ' + id);
    const remTrack = (id) => globalConfig.setAsync('trackField', trackField.includes(' ' + id) ? trackField.replace(' ' + id, '') : trackField.replace(id, ''));

   
    //creating discussion table. call when save button clicked
    async function createDiscussionTable() {
        const name = 'Discussion by TeamUp!';
        const fields = [
            // Name will be the primary field of the table.
            { name: 'title', type: FieldType.SINGLE_LINE_TEXT },
            { name: 'content', type: FieldType.MULTILINE_TEXT }
            

        ];
        if (base.unstable_hasPermissionToCreateTable(name, fields)) {
            return await base.unstable_createTableAsync(name, fields);
        }

    }
    //creating comment table. call when save button clicked
    async function createCommentTable() {
        const name = 'Comments by TeamUp!';
        const fields = [
            // Name will be the primary field of the table.
            { name: 'idDiscussion', type: FieldType.SINGLE_LINE_TEXT },
            { name: 'comment', type: FieldType.MULTILINE_TEXT }
            

        ];
        if (base.unstable_hasPermissionToCreateTable(name, fields)) {
            return await base.unstable_createTableAsync(name, fields);
        }

    }

    

    return (
        <Box
            padding={3}
        >
            <Heading>TeamUp! Blocks Setting</Heading>
            <Box
                display="flex"
                flexDirection="column"
            >
                <Label htmlFor="api_picker">Input Airtable API key</Label>
                <Input
                    type="password"
                    value={apiValue}
                    onChange={e => setApiValue(e.target.value)}
                    disabled={!canSetApiValue}
                    placeholder="Your Airtable Api Key"
                    width="auto"
                />
            </Box>
            <br />
            <Box
                display="flex"
                flexDirection="column"
            >
                <Heading>TeamUp! Activity Setting</Heading>
                <Label htmlFor="table_picker">Select task table</Label>
                <TablePickerSynced id="table_picker" width="auto" globalConfigKey="selectedTableId" />

            </Box>
            <br />

            <Box
                display="flex"
                flexDirection="column"
            >
                <Label htmlFor="checkbox_track">Choose field that want to track the changes</Label>

                {table != null ? <> <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="wrap"
                >
                    {/* {console.log(table.fields[0].name)} */}
                    {
                        table.fields.map((f,i) => {
                            {
                                return (<Checkbox key={i} label={f.name} checked={trackField.includes(f.id) ? true : false} onChange={() => {
                                    //console.log('glob' + globalConfig.get('filterOpt'));

                                    trackField.includes(f.id) ? remTrack(f.id) : addTrack(f.id);
                                    //setarrTrackField(arrTrackField == undefined ? f.id : arrTrackField.includes(f.id) ? remTrackState(f.id) : addTrackState(f.id))

                                }} />)
                            }

                        })
                    }


                </Box>
                    {trackField != undefined ? trackField.split(" ").map((tf, idx) => {
                        const field = table.getFieldByIdIfExists(tf);
                        console.log(field)

                        return (tf != "" ?
                            <Box
                                border="thick"
                                borderColor="primary"
                                backgroundColor="lightGray1"
                                width="auto"
                                overflow="hidden"
                                marginTop={2}
                            >
                                <Heading padding={2} size="xsmall" width="auto">{field.name}</Heading>
                                <Box
                                    display="flex"
                                    padding={2}
                                    flexDirection="row"
                                    justifyContent="space-around"
                                    flexWrap="wrap"
                                    width="auto"
                                >
                                    <Box display="flex" flexDirection="column" flexGrow={1} width="auto">
                                        <Label htmlFor={'modBy_' + field.id}>LastModifiedBy</Label>
                                        <FieldPickerSynced
                                            id={'modBy_' + field.id}
                                            table={table}
                                            allowedTypes={["lastModifiedBy"]}
                                            globalConfigKey={'modBy_' + field.id}
                                            width="auto"
                                        />
                                    </Box>
                                    <Box display="flex" flexDirection="column" flexGrow={1} width="auto">
                                        <Label htmlFor={'modTime_' + field.id}>LastModifiedTime</Label>
                                        <FieldPickerSynced
                                            id={'modTime_' + field.id}
                                            table={table}
                                            allowedTypes={["lastModifiedTime"]}
                                            globalConfigKey={'modTime_' + field.id}
                                            width="auto"
                                        />
                                    </Box>
                                </Box>
                            </Box> : <Box
                                border="thick"
                                borderColor="primary"
                                backgroundColor="lightGray1"
                                width="auto"
                                overflow="hidden"
                                marginTop={2}
                            ></Box>
                        )
                    }) : null}
                </>
                    : <p>please select the table first</p>}
            </Box>


            <br />
            <Box
                display="flex"
                flexDirection="column"
            >
                <Label htmlFor="checkbox_field">Choose field as filtering option</Label>

                {table != null ? <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="wrap"
                >
                    {/* {console.log(table.fields[0].name)} */}
                    {
                        table.fields.map((f,i) => {
                            {
                                return (<Checkbox key={i} label={f.name} checked={filterOpt.includes(f.id) ? true : false} onChange={() => {
                                    console.log('glob' + globalConfig.get('filterOpt'));

                                    filterOpt.includes(f.id) ? remFilter(f.id) : addFilter(f.id);

                                }} />)
                            }

                        })
                    }


                </Box>
                    : <p>please select the table first</p>}
            </Box>


            <br />
            <Box
                display="flex"
                flexDirection="column"
            >
                <Heading>TeamUp! Discussion Setting</Heading>
                <Label htmlFor="disc_table_picker">Choose Discussion table</Label>

                <Button onClick={
                    async () => {
                        
                        if (discussionTable == "" || base.getTableByIdIfExists(discussionTable) == null) {
    
                            const discussTable = await createDiscussionTable();
                            
                            if (base.getTableByIdIfExists(discussTable.id) != null) {
                                discussionTableId = globalConfig.setAsync('selectedDiscTableId', discussTable.id)
                                
                            }
    
    
    
                        } 
                        else{
                            alert('failed to generate discussion table')
                        }
                    }
                }>Generate Discussion Table</Button>
                <TablePickerSynced marginTop={1} marginBottom={1} placeholder="please generate discussion table before" disabled={true} id="disc_table_picker" width="auto" globalConfigKey="selectedDiscTableId" />

                {discussionTable!=null?<Label htmlFor="cby_field_picker">Choose created by field</Label>:<>-</>}
                <FieldPickerSynced
                    table={discussionTable}
                    globalConfigKey="createdByDiscField"
                    allowedTypes={["createdBy"]}
                    disabled={discussionTableId!=null?false:true}
                    width="auto"
                    placeholder="please make new  'create by' field in disscussion table"
                />

<br/>
                
                <Label htmlFor="comm_table_picker">Choose Comment table</Label>

                <Button onClick={
                    async () => {
                        
                        if (commTable == "" || base.getTableByIdIfExists(commTable) == null) {
    
                            const commentTable = await createCommentTable();
                            
                            if (base.getTableByIdIfExists(commentTable.id) != null) {
                                commTableId = globalConfig.setAsync('selectedCommTableId', commentTable.id)
                                
                            }
    
    
    
                        } 
                        else{
                            alert('failed to generate comments table')
                        }
                    }
                }>Generate Comments Table</Button>
                <TablePickerSynced marginTop={1} marginBottom={1} placeholder="please generate comments table before" disabled={true} id="comm_table_picker" width="auto" globalConfigKey="selectedCommTableId" />
                
                {commTable!=null?<Label htmlFor="cbyComm_field_picker">Choose created by field</Label>:<>-</>}
                
                <FieldPickerSynced
                    table={commTable}
                    globalConfigKey="createdByCommField"
                    allowedTypes={["createdBy"]}
                    disabled={commTableId!=null?false:true}
                    width="auto"
                    placeholder="please make new 'create by' field in comments table"
                />
    
            </Box>
            <br />
                <br/>
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
            >
                <Button variant="primary" onClick={()=>{
                    setIsLoading(true)
                    globalConfig.setAsync('setUp','true')
                    setTimeout(function () {
                        setIsLoading(false)
                    }, 2300)
                }}> Save</Button>{isLoading ? <Loader marginLeft={2} scale={0.4} /> : <></>}
            </Box>
        </Box>
    )

};

SettingForm.propTypes = {
    setIsSettingOpen: PropTypes.func.isRequired,
};

export default SettingForm;

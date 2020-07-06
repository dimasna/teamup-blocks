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
import moment from 'moment';


const View = ({ setIsViewOpen, isViewOpen, setSelectedMenu, setRecordState, recordState }) => {
    
    const [commentValue, setCommentValue] = React.useState("");
    const [isLoad, setIsLoad] = React.useState(false);
    const [isUpdatedComm, setIsUpdatedComm] = React.useState(false);
    const [records, setRecords] = useState({});
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const commTable = base.getTableByIdIfExists(globalConfig.get('selectedCommTableId'));
    const discussTable = base.getTableByIdIfExists(globalConfig.get('selectedDiscTableId'));
    const creatorField = discussTable.getFieldByIdIfExists(globalConfig.get('createdByDiscField'));
    const commentatorField = commTable.getFieldByIdIfExists(globalConfig.get('createdByCommField'));
    
    const creator = recordState.getCellValue(creatorField);
    const content = recordState.getCellValue('content');

    const diffDate = moment(recordState.createdTime).fromNow();

    const recordComments = commTable.selectRecords();
    let recordsBlock = useRecords(recordComments);

    let commRecordFiltered= recordsBlock.filter(function(element, i, array) {
        return (element.name == recordState.id ); 
    });

    //console.log(commRecordFiltered);
    
    let recordfield;
useEffect(() => {
 setRecords(commRecordFiltered)
}, [])

useEffect(() => {
    if(isUpdatedComm){
        setRecords(commRecordFiltered);
        setIsUpdatedComm(false)
    }
    
}, [isUpdatedComm])

    useEffect(() => {
     recordfield = { 'idDiscussion': recordState.id,
     'comment': commentValue}
    }, [commentValue])

    


    async function createNewComment(recordFields) {
        if (commTable.hasPermissionToCreateRecord(recordFields)) {
            return await commTable.createRecordAsync(recordFields);
        }


    }


    return (<>
        <Box
            display="flex"
            padding={3}
            width="auto"
            flexDirection="column">
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                borderBottom="default"
                paddingBottom={2}
            >
                <Box width={30} alignSelf="flex-end"><TextButton
                    onClick={() => setIsViewOpen(!isViewOpen)}
                    variant="dark"
                    size="xlarge"
                    icon="left"
                    aria-label="Back"
                /></Box>

            </Box>

            <br />
            <Box><Heading size="large">{recordState ? recordState.name : <>null</>}</Heading></Box>
            <br />
            <Box
                display="flex"
                flexDirection="row"
            >
                <Box
                    display="flex"

                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        style={{ backgroundSize: "cover", backgroundImage: "url(" + `${creator.profilePicUrl != undefined ? creator.profilePicUrl : 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg'}` + ")" }}
                        borderRadius="circle"
                        width={35}
                        height={35}
                        overflow="hidden">

                    </Box>
                </Box>
                
                <Box
                    display="flex"
                    width="auto"
                    paddingLeft={3}
                    flexDirection="column">
                    <Box
                        overflow="hidden"
                        style={{ wordWrap: "break-word" }}
                    >
                        <Text size="large" fontWeight="bold">{creator.name} <Text as="span" textColor="light">{diffDate}</Text></Text>
                    </Box>


                    <Box style={{
                        display: "table",
                        tableLayout: "fixed",
                        width: "100%", wordWrap: "break-word"
                    }}>
                        {recordState ?<Text size="large" variant="paragraph"> {content} </Text>: <>null</>}
                    </Box>



                </Box>
            </Box>

            

            <br/>
            <Box
                display="flex"
                flexDirection="row"
            >
                           
                
                <Box
                    width="100%"
                    
                    >
                    


                    <textarea
                    id="titleTopic"
                    rows="5" 
                    value={commentValue}
                    style={{width:"100%", maxWidth:"100%",minWidth:"100%",border:"solid 0.5pt"}}
                    onChange={e => setCommentValue(e.target.value)}
                ></textarea>



                </Box>
            </Box>
            <Box
            display="flex"
            flexDirection="row"
            width="auto"
            >
                <Button variant="primary" onClick={async () => {
                setIsLoad(true)
                const recordId = await createNewComment(recordfield);
                if(recordId != null){
                    setIsLoad(false)
                    setIsUpdatedComm(true)
                    setCommentValue("")
                    //setSelectedMenu(1)
                    //setIsAddViewOpen(!isAddViewOpen)

                }else{
                    alert('failed to add new topic')
                }
            }}>Comment</Button>
            </Box>
                    <br/>
            <Heading size="small">Comments :</Heading>

            {Object.keys(records).length != 0? records.map(rc=>{

const commentator = rc.getCellValue(commentatorField);
const commentBody = rc.getCellValue('comment');

                return(<>
                    <Box
                display="flex"
                flexDirection="row"
            >
                <Box
                    display="flex"

                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        style={{ backgroundSize: "cover", backgroundImage: "url(" + `${commentator.profilePicUrl != undefined ? commentator.profilePicUrl : 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg'}` + ")" }}
                        borderRadius="circle"
                        width={35}
                        height={35}
                        overflow="hidden">

                    </Box>
                </Box>
                
                <Box
                    display="flex"
                    width="auto"
                    paddingLeft={3}
                    flexDirection="column">
                    <Box
                        overflow="hidden"
                        style={{ wordWrap: "break-word" }}
                    >
                        <Text size="large" fontWeight="bold">{commentator.name} <Text as="span" textColor="light">{diffDate}</Text></Text>
                    </Box>


                    <Box style={{
                        display: "table",
                        tableLayout: "fixed",
                        width: "100%", wordWrap: "break-word"
                    }}>
                        {recordState ?<Text size="large" variant="paragraph"> {commentBody} </Text>: <>null</>}
                    </Box>



                </Box>
            </Box>
            <br/>
               </> )

            }):<p>no comments</p>}

        </Box>

        <br />

    </>
    )
};

View.propTypes = {
    setIsAddViewOpen: PropTypes.func.isRequired,
};

export default View;

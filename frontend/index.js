import React, { useState, useEffect } from 'react';
import {
    initializeBlock,
    TablePickerSynced,
    ViewPickerSynced,
    Input,
    TextButton,
    Text,
    Label,
    Box,
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
    loadCSSFromURLAsync,
    ViewportConstraint
} from '@airtable/blocks/ui';
import { settingsButton,viewport } from '@airtable/blocks';


loadCSSFromURLAsync('https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css');
import SettingForm from './SettingForm'
import AddView from './Discussion/AddView'
import View from './Discussion/View'
import Main from './Main'

const optionFeature = [
    { value: 0, label: "Activity" },
    { value: 1, label: "Discussion" }
  
];


const TeamUpBlock = () => {
    const [selectedMenu, setSelectedMenu] = useState(optionFeature[0].value);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [isAddViewOpen, setIsAddViewOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [recordState, setRecordState] = useState({});
    const [isSetUp, setIsSetUp] = useState(false);
    useSettingsButton(() => setIsSettingOpen(!isSettingOpen));
    

//viewport.addMinSize({width: 365})


    const base = useBase();
    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const table = base.getTableByIdIfExists(tableId);
    const setup = globalConfig.get('setUp')
   
    useEffect(() => {
      console.log(recordState)
    }, [recordState])

    function renderSwitch(param) {
        switch(param) {
          case (setup!=null?isSettingOpen:true):
            return <SettingForm setIsSettingOpen={setIsSettingOpen} table={table} />;
          case (setup!=null?isAddViewOpen:false):
            return <AddView setSelectedMenu={setSelectedMenu} setIsAddViewOpen={setIsAddViewOpen} isAddViewOpen={isAddViewOpen} setIsViewOpen={setIsViewOpen}  isViewOpen={isViewOpen}/>;
          case (setup!=null?isViewOpen:false):
            return <View recordState={recordState} setRecordState={setRecordState} setSelectedMenu={setSelectedMenu} setIsViewOpen={setIsViewOpen}  isViewOpen={isViewOpen} />;
          default:
            return <Main recordState={recordState} setRecordState={setRecordState} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} setIsAddViewOpen={setIsAddViewOpen} isAddViewOpen={isAddViewOpen} table={table} setIsViewOpen={setIsViewOpen}  isViewOpen={isViewOpen}/>;
        }
      }
      


    return (<ViewportConstraint minSize={{width:367}}>


        {
    
    renderSwitch(true)
}</ViewportConstraint>)
}
initializeBlock(() => <TeamUpBlock />);

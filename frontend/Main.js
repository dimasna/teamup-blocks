import PropTypes from 'prop-types';
import React, { useState,useEffect } from 'react';

import {
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
    useSettingsButton
} from '@airtable/blocks/ui';

import { FieldType } from '@airtable/blocks/models';
import TeamActivity from './Menu/TeamActivity';
import TeamDiscussion from './Menu/TeamDiscussion';


const optionFeature = [
    { value: 0, label: "Activity" },
    { value: 1, label: "Discussion" }
 
];


const optionSort = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" }
]
   

const NavMenu = (props) => {
    
    return (
        <SelectButtons
            value={props.selectedMenu}
            style={{ marginRight: 2 }}
            onChange={newValue => props.setSelectedMenu(newValue)}
            options={optionFeature}
            width="auto"
        />
    );
};

const ButtonFilter = (props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);



    return (
        <React.Fragment>
            <Button icon='filter' onClick={() => setIsDialogOpen(true)}>Filter</Button>
            {isDialogOpen && (
                <Dialog onClose={() => setIsDialogOpen(false)} width="320px">
                    <Dialog.CloseButton />
                    <Heading>Filter</Heading>
                    <FieldFilter filterValue={props.filterValue} setFilterValue={props.setFilterValue} />
                    <br />
                    <Button onClick={() => {
                      
                        props.setRealFilterValue(props.filterValue)
                        setIsDialogOpen(false)}}>Apply</Button>
                </Dialog>
            )}
        </React.Fragment>
    );

};
const FieldFilter = (props) => {

    const base = useBase();
    const globalConfig = useGlobalConfig();
    const filterOptOri = globalConfig.get("filterOpt");
    //let selectedFieldValueFilter = globalConfig.get('fieldValue') || {};
    //const addFilterValue = (id,fid) => globalConfig.setAsync('fieldValue', filterOpt == "" ?id:filterOpt+' '+id);
    //const remFilterValue = (id,fid) => globalConfig.setAsync('fieldValue', filterOpt.includes(' '+id)?filterOpt.replace(' '+id,''):filterOpt.replace(id,''));
    const filterOpt =filterOptOri.split(" ");
    const tableId = globalConfig.get('selectedTableId');
    const table = base.getTableByIdIfExists(tableId);

   

    let optionsFieldFilter = [];
    let tempOpt = [];

    //let selectedFieldValueFilter=[];

    filterOpt != null ? filterOpt.forEach(fid => {
        //console.log('id :'+filterOpt)
        const filterField = table.getFieldByIdIfExists(fid);

        if (filterField) {

            filterField.options.choices.forEach(opt => {
                tempOpt.push({ value: opt.id, label: opt.name })

            })

            optionsFieldFilter.push(
                { [filterField.name.replace(" ", "_")]: tempOpt }
            )
            console.log(tempOpt);
            tempOpt = [];



        }
    }
    ) : null;




    

    //console.log(selectedFieldValueFilter);
    return (<Box
        display="flex"
        flexDirection="column"
    ><SelectFilterField optionsFieldFilter={optionsFieldFilter} value={props.filterValue} setValue={props.setFilterValue}/></Box>)
    

}

const SelectFilterField = (props) =>{ 
    

  return props.optionsFieldFilter.map((f, index) => {
    const field = Object.keys(f)[0];
    const optField = Object.values(f)[0];
    const allFilter = [{value: 'All' , label:'All'}]
    const [opt, setOpt] = useState(allFilter.concat(optField))
    const opts = opt.map(o => ({value:o.value , label:o.label}))
   
    console.log(optField);

    useEffect(() => {
      
        console.log(props.value)
     
    }, [props.value])

    const selectedOpt = (event) => {
        props.setValue((prevState) => ({
           ...prevState,
           [event.target.id]: event.target.value
        }));
    }
    return (<>
        <Label key={'l'+index} htmlFor={field + 'Filter'}>{field}</Label>
        <select key={index}
        className="css-1xax9yo"
            id={field}
            value={props.value[field]}
            onChange={e => {
                e.persist();
                // e.preventDefault();
                selectedOpt(e)
                
            }
            }
            width="auto"

        >
            {
                opts.map((o,i) => <option key={i} value={o.value.substring(0,3)=='usr'?o.value:o.label}>{o.label}</option>)
            }
            </select>
            </>
            )
})
}
const SelectSort = (props) => {
    
    return (
        <Select
            id='select_sort'
            options={optionSort}
            value={props.sort}
            onChange={newValue => props.setSort(newValue)}
            width="auto"
        />
    );
};
const Main = ({ table,setIsAddViewOpen,isAddViewOpen,setSelectedMenu,selectedMenu,setIsViewOpen,isViewOpen,setRecordState,recordState }) => {
    
    
    const [sort, setSort] = useState(optionSort[0].value);
    const [filterValue, setFilterValue] = useState({});
    const [realfilterValue, setRealFilterValue] = useState({});
    const [btnFilter, setBtnFilter] = useState(false);
    const globalConfig = useGlobalConfig();
    const base = useBase();

    useEffect(() => {
        
          console.log(realfilterValue)
       
      }, [realfilterValue])

    return (
        <>
        <Box position="sticky" top={0} zIndex={20} backgroundColor="white">
            <Box
                backgroundColor="white"
                paddingTop={3}
                paddingLeft={3}
                paddingRight={3}
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                flexDirection="row"
                width="auto"
               
            >

                <Heading size="large" textColor="light">
                    Team {optionFeature[selectedMenu].label}
                    </Heading>
              




            </Box>
            <Box
                backgroundColor="white"
                paddingLeft={3}
                paddingRight={3}
                paddingBottom={2}

            >
                <hr />
                <NavMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>
            </Box>
            {selectedMenu == 1 ?<></>:
            <Box
                backgroundColor="lightGray1"
                paddingTop={2}
                paddingBottom={2}
                paddingLeft={3}
                paddingRight={3}
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="space-between"
                alignItems="center"
            >
                
                <Box
                    display="flex"
                    flexWrap="wrap"
                    alignItems="center">

                    <ButtonFilter filterValue={filterValue} setFilterValue={setFilterValue} setRealFilterValue={setRealFilterValue}/>
                </Box>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    alignItems="center">
                    <Label htmlFor="select_sort" textColor="light" marginRight={2}>Sort By</Label>
                    <SelectSort sort={sort} setSort={setSort} />
                </Box>

            </Box>}
        </Box>
            {selectedMenu == 0?<TeamActivity table={table} sort={sort} filter={realfilterValue}  />
            :<TeamDiscussion table={table} sort={sort} filter={realfilterValue} setIsViewOpen={setIsViewOpen}  isViewOpen={isViewOpen} 
            setSelectedMenu={setSelectedMenu} setIsAddViewOpen={setIsAddViewOpen} isAddViewOpen={isAddViewOpen} setRecordState={setRecordState} recordState={recordState}/>
}
        </>
    )

};

Main.propTypes = {
    table: PropTypes.any.isRequired,
};

export default Main;

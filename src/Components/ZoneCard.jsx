import { Box, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Stat, StatLabel, StatNumber, Text, useEditableControls } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useState } from "react";
import { MdCancel, MdCheck, MdEdit, MdMoreVert } from "react-icons/md";

export const categoryColors = {
    "good": "#8DCFD0",
    "soso": "#FFCC6D",
    "bad": "#F98A7F",
}

export default function ZoneCard({ time, zoneName, name, editZoneName, removeZoneCard, zoneIndex }) {

    const EditButtons = () => {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls()

        return isEditing ? (
            <ButtonGroup justifyContent='center' size='sm' marginLeft={"0.5em"}>
                <IconButton icon={<Icon as={MdCheck} />} {...getSubmitButtonProps()} />
                <IconButton icon={<Icon as={MdCancel} />} {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent='center' marginLeft={"0.25em"}>
                <IconButton variant={"ghost"} size='sm' icon={<Icon as={MdEdit}  />} {...getEditButtonProps()} />
            </Flex>
        )

    }

    const localTime = DateTime.fromMillis(time).setZone(zoneName)
    const color = (localTime.hour >= 7 && localTime.hour <= 20) ? (localTime.hour >= 8 && localTime.hour <= 18) ? 'good' : 'soso' : 'bad';


    const saveCardName = (e) => {
        editZoneName(zoneIndex, e)
    }

    return <Box display={"flex"} width={"100%"} justifyContent={"space-between"} padding={"1em"} boxSizing="border-box"
        backgroundColor={categoryColors[color]}
        border={"solid 2px #545454 "}
        borderRadius={"0.5em"}
        boxShadow={"5px 5px 0 #545454"}
        marginBottom={"1em"}
    >
        <Stack direction="column" alignItems={"flex-start"} fontFamily={"Shrikhand, sans-serif"} color={"#545454"} fontSize={"20px"}>
            <Editable defaultValue={`${name}`} onSubmit={saveCardName} display={"flex"} flexDirection={"row"}>
                <EditablePreview />
                <EditableInput/>
                <EditButtons />
            </Editable>
            <Text
                fontFamily={"Share, sans-serif"}
                fontSize={"16px"}
                fontWeight={"bold"}
                fontStyle={"italic"}
            >{localTime.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS).toUpperCase()}</Text>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>

            <Stat>
                <StatNumber width={"fit-content"} fontFamily={"Shrikhand, sans-serif"} fontSize={"36px"} color={"#545454"}>{localTime.toLocaleString(DateTime.TIME_24_SIMPLE)}</StatNumber>
            </Stat>
            <Menu>

                <MenuButton as={IconButton} aria-label="Edit" size={"lg"} fontSize={"24px"} backgroundColor={"transparent"} icon={<Icon as={MdMoreVert} />} />
                <MenuList>
                    <MenuItem onClick={() => removeZoneCard(zoneIndex)}>Remover</MenuItem>
                    {/* <MenuItem>Fixar no Topo</MenuItem> */}
                </MenuList>
            </Menu>
        </Stack>
    </Box>
}
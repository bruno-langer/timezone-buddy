import { Box, Button, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useMemo, useState } from "react"
// import { FaSearch } from "react-icons/fa"

const SearchSelect = ({ options, onChange }) => {
    const [searchValue, setSearchValue] = useState("")
    const [inputFocused, setInputFocused] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()


    const filteredOptions = useMemo(() => {
        return options.filter(option => option.toLowerCase().includes(searchValue.toLowerCase()))
    }, [searchValue, options])

    const handleChange = (event) => {
        setSearchValue(event.target.value)
    }

    const handleFocus = () => {
        setInputFocused(true)
    }

    const handleBlur = () => {
        setTimeout(() => {
            setInputFocused(false)
        }, 100)
    }

    return (

        <>
            <Button
                backgroundColor={"transparent"}
                color={"#545454"}
                fontFamily={"Share , sans-serif"}
                fontStyle={"italic"}
                fontWeight={"bold"}
                border={"solid 2px #545454"}
                borderRadius={"0.5em"}
                boxShadow={"2px 2px 0 #545454"}
                onClick={onOpen}
            >NOVO FUSO</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontFamily={"Shrikhand, sans-serif"} color={"#545454"}
                    >Escolha uma Timezone</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box position="relative" zIndex={10}>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                </InputLeftElement>
                                <Input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    value={searchValue}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    border={"solid 2px #545454"}
                                    fontFamily={"Share , sans-serif"}
                                />
                                {inputFocused && (
                                    <Box
                                        position="absolute"
                                        top="100%"
                                        left="0"
                                        right="0"
                                        maxHeight="40em"
                                        overflowY="auto"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        borderRadius="md"
                                        backgroundColor="white"
                                        zIndex={2}
                                    >
                                        {filteredOptions.map((option, index) => (
                                            <Box
                                                key={index}
                                                paddingY="0.3em"
                                                paddingX="0.5em"
                                                cursor="pointer"
                                                _hover={{ backgroundColor: "gray.100" }}
                                                onClick={() => { onChange(option); setInputFocused(false) }}
                                                display={"flex"}
                                                fontFamily={"Share , sans-serif"}
                                                justifyContent={"flex-start"}
                                            >
                                                {option}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </InputGroup>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            backgroundColor={"transparent"}
                            color={"#545454"}
                            fontFamily={"Share , sans-serif"}
                            fontStyle={"italic"}
                            fontWeight={"bold"}
                            border={"solid 2px #545454"}
                            borderRadius={"0.5em"}
                            boxShadow={"2px 2px 0 #545454"}
                            variant='ghost' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </>

    )
}

export default SearchSelect

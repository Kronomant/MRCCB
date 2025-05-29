'use client'

import React, { useState } from "react";
import {
  ActionBar,
  Box,
  Button,
  Checkbox,
  Kbd,
  Portal,
  Table,
  Text,
  Spinner
} from "@chakra-ui/react"

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: React.ReactNode[];
  emptyMessage?: string
  isLoading?: boolean
}

export const BaseTable = <T extends { id: number }>({
  data,
  columns,
  actions,
  emptyMessage = "Nenhum dado encontrado",
  isLoading = false,
}: Props<T>) => {

  const [selection, setSelection] = useState<number[]>([])

  const hasSelection = selection.length > 0
  const indeterminate = hasSelection && selection.length < data.length

  const rows = data.map((item) => (
    <Table.Row
      key={item.id}
      data-selected={selection.includes(item.id) ? 1 : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(item.id)}
          onCheckedChange={(changes: { checked: any; }) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.id]
                : selection.filter((id) => id !== item.id),
            )
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      
      {
        columns.map((column, colIndex) => (
          <Table.Cell 
            key={colIndex}
            color="fg"
          >
            {column.customRender
              ? column.customRender(item)
              : column.accessor
                ? String(item[column.accessor])
                : null}
          </Table.Cell>
        ))
      }
      
    </Table.Row>
  ))

  return (
    <Box p={0} borderRadius="md" shadow="2xl" height="full" >
      {
        isLoading 
        ? (
            <Box textAlign="center" py={10}>
              <Spinner size="lg" color="gray"/>
              <Text color="gray">Loading...</Text>
            </Box>
          )
        : data.length <= 0 
        ? (
            <Text textAlign="center" color="gray">{emptyMessage}</Text>
          )
        : (
          <Table.ScrollArea borderWidth="1.5px" shadow="md" rounded="md" height="full">
            <Table.Root interactive stickyHeader colorPalette="gray" height="full">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="6">

                    <Checkbox.Root
                      size="sm"
                      top="0.5"
                      aria-label="Select all rows"
                      checked={indeterminate ? "indeterminate" : selection.length > 0}
                      onCheckedChange={ (changes: { checked: any; }) => {
                        setSelection(
                          changes.checked ? data.map((item) => item.id) : [],
                        )
                      }}
                    >
                        
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />

                    </Checkbox.Root>

                  </Table.ColumnHeader>
                  
                  {
                    columns.map( column => {
                      return <Table.ColumnHeader>{column.header}</Table.ColumnHeader>
                    })
                  }
                  
                </Table.Row>
              </Table.Header>


              <Table.Body>{rows}</Table.Body>


            </Table.Root>

            <ActionBar.Root open={hasSelection}  shadow="xl">
              <Portal>
                <ActionBar.Positioner>
                  <ActionBar.Content >

                    <ActionBar.SelectionTrigger color="fg">
                      {selection.length} selected
                    </ActionBar.SelectionTrigger>

                    <ActionBar.Separator />

                    {actions && actions.map((action, index) => (
                      <React.Fragment key={index}>
                        {action}
                      </React.Fragment>
                    ))}

                  </ActionBar.Content>
                </ActionBar.Positioner>
              </Portal>
            </ActionBar.Root>
          </Table.ScrollArea>
        )
      }
    </Box>
  )
}
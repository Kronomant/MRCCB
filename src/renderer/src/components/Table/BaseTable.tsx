'use client'

import React, { useState } from 'react'
import {
  ActionBar,
  Box,
  Button,
  Checkbox,
  Kbd,
  Portal,
  Table,
  Text,
  Spinner,
  Flex
} from '@chakra-ui/react'

type Props<T> = {
  data: T[]
  columns: Column<T>[]
  actions?: React.ReactNode[]
  emptyMessage?: string
  isLoading?: boolean
  onRowClick?: (row: T) => void
  hasCheckbox?: boolean
  drawerOpen?: boolean
}

export const BaseTable = <T extends { id: number }>({
  data,
  columns,
  actions,
  emptyMessage = 'Nenhum dado encontrado',
  isLoading = false,
  onRowClick,
  hasCheckbox = false,
  drawerOpen = false
}: Props<T>) => {
  const [selection, setSelection] = useState<number[]>([])

  const hasSelection = selection.length > 0
  const indeterminate = hasSelection && selection.length < data.length

  const rows = data.map((item) => (
    <Table.Row
      key={item.id}
      data-selected={selection.includes(item.id) ? 1 : undefined}
      onClick={() => onRowClick?.(item)}
    >
      {hasCheckbox && (
        <Table.Cell>
          <Checkbox.Root
            size="sm"
            top="0.5"
            aria-label="Select row"
            checked={selection.includes(item.id)}
            onCheckedChange={(changes: { checked: any }) => {
              setSelection((prev) =>
                changes.checked ? [...prev, item.id] : selection.filter((id) => id !== item.id)
              )
            }}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
        </Table.Cell>
      )}

      {columns.map((column, colIndex) => (
        <Table.Cell key={colIndex} color="fg">
          {column.customRender
            ? column.customRender(item)
            : column.accessor
              ? String(item[column.accessor])
              : null}
        </Table.Cell>
      ))}
    </Table.Row>
  ))

  return (
    <Box
      height="100%"
      transition="max-width 0.4s cubic-bezier(.4,0,.2,1), filter 0.4s cubic-bezier(.4,0,.2,1)"
      maxWidth={drawerOpen ? 'calc(100% - 400px)' : '100%'}
      flex="1 1 0%"
    >
      <Flex w="100%" h="100%" flexDir="column">
        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="lg" color="gray" />
            <Text color="gray">Loading...</Text>
          </Box>
        ) : data.length <= 0 ? (
          <Text textAlign="center" color="gray">
            {emptyMessage}
          </Text>
        ) : (
          <Table.ScrollArea borderWidth="1px" rounded="md" height="full">
            <Table.Root interactive stickyHeader colorPalette="gray" height="full">
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  {hasCheckbox && (
                    <Table.ColumnHeader w="6">
                      <Checkbox.Root
                        size="sm"
                        top="0.5"
                        aria-label="Select all rows"
                        checked={indeterminate ? 'indeterminate' : selection.length > 0}
                        onCheckedChange={(changes: { checked: any }) => {
                          setSelection(changes.checked ? data.map((item) => item.id) : [])
                        }}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.ColumnHeader>
                  )}

                  {columns.map((column) => {
                    return <Table.ColumnHeader>{column.header}</Table.ColumnHeader>
                  })}
                </Table.Row>
              </Table.Header>
              <Table.Body>{rows}</Table.Body>
            </Table.Root>
            <ActionBar.Root open={hasSelection} shadow="xl">
              <Portal>
                <ActionBar.Positioner>
                  <ActionBar.Content>
                    <ActionBar.SelectionTrigger color="fg">
                      {selection.length} selected
                    </ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    {actions &&
                      actions.map((action, index) => (
                        <React.Fragment key={index}>{action}</React.Fragment>
                      ))}
                  </ActionBar.Content>
                </ActionBar.Positioner>
              </Portal>
            </ActionBar.Root>
          </Table.ScrollArea>
        )}
      </Flex>
    </Box>
  )
}

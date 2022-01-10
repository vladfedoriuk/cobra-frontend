import { SxProps, Theme } from '@mui/system'
import Box from '@mui/system/Box'
import React from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

type ListProps = {
  height: number
  width: number
  itemSize: number
  itemCount: number
  overscanCount: number
  renderRow: (props: ListChildComponentProps) => React.ReactElement
  itemData: any[]
  boxSx?: Partial<SxProps<Theme>>
}

const List: React.FC<ListProps> = ({
  height,
  width,
  itemSize,
  itemCount,
  overscanCount,
  renderRow,
  itemData,
  boxSx,
}): React.ReactElement => {
  return (
    <Box
      sx={{
        height,
        width: '100%',
        maxWidth: 'lg',
        bgcolor: 'background.paper',
        ...boxSx,
      }}
    >
      <FixedSizeList
        height={height}
        width={width}
        itemSize={itemSize}
        itemCount={itemCount}
        overscanCount={overscanCount}
        itemData={itemData}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  )
}

export default List

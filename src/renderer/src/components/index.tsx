import { Box, Grid2, GridSize, ListItem, ListItemButton, Stack, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

type ListItemTemplate = {
  key: string
  label?: string | null
  labelVariant?: Variant
  valueVariant?: Variant
  showLabel?: boolean
  textAlign?: 'left' | 'center' | 'right'
  size?: GridSize
  format?: (value: unknown) => string | number | null | undefined
}

/** List - Item */
export function ListItemBox<TI extends ListItemTemplate, T = unknown>(props: {
  item: T
  selected?: boolean
  template: { [k: string]: TI }
  onClick?: (value: T) => void
}) {
  return (
    <ListItem disablePadding dense>
      <ListItemButton selected={props.selected} onClick={() => props.onClick?.(props.item)}>
        <Grid2 container>
          {Object.entries(props.template).map(([k, v], i) => {
            return (
              <Grid2 key={i} data-key={k} size={v.size}>
                {v.showLabel && (
                  <Box>
                    <Typography variant={v.labelVariant}>{v.label}:</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant={v?.valueVariant} textAlign={v?.textAlign}>
                    {v?.format?.(props.item?.[v.key]) || props.item[v.key]}
                  </Typography>
                </Box>
              </Grid2>
            )
          })}
        </Grid2>
      </ListItemButton>
    </ListItem>
  )
}

export type KanbanBoxTemplate = {
  key: string
  label?: string | null
  showLabel?: boolean
  labelVariant?: Variant
  valueVariant?: Variant
  // 对齐方式
  textAlign?: 'left' | 'center' | 'right'
  // 自动换行
  wrap?: boolean
  format?: (value: unknown) => string | number | null | undefined
}

export function KanbanBox<DT extends KanbanBoxTemplate, T = unknown>(props: {
  data: T
  direction?: 'row' | 'column'
  template: { [s: string]: DT }
}) {
  return (
    <Box width={1} height={1}>
      <Stack direction={props.direction} spacing={1}>
        {Object.entries(props.template).map(([k, v], i) => (
          <Box key={i} data-key={k}>
            <Grid2 container>
              {v.showLabel && (
                <Grid2>
                  <Box>
                    <Typography variant={v.labelVariant}>{v.label}:</Typography>
                  </Box>
                </Grid2>
              )}
              <Grid2>
                <Box>
                  <Typography variant={v?.valueVariant} textAlign={v?.textAlign} noWrap={v?.wrap}>
                    {v?.format?.(props.data?.[v.key]) || props.data[v.key]}
                  </Typography>
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

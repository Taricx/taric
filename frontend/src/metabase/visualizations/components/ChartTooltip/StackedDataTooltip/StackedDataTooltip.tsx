import React, { useMemo } from "react";
import { color } from "metabase/lib/colors";
import { TooltipRow, TooltipTotalRow } from "../TooltipRow";
import type { StackedTooltipModel } from "../types";
import {
  DataPointHeader,
  DataPointTableHeader,
  DataPointRoot,
  DataPointTableBody,
  DataPointTable,
  DataPointTableFooter,
} from "./StackedDataTooltip.styled";
import { getPercent, getTotalValue, groupExcessiveTooltipRows } from "./utils";

const MAX_BODY_ROWS = 8;

type StackedDataTooltipProps = StackedTooltipModel;

const StackedDataTooltip = ({
  headerTitle,
  headerRows,
  bodyRows = [],
  grandTotal,
  showTotal,
  showPercentages,
  totalFormatter = (value: unknown) => String(value),
}: StackedDataTooltipProps) => {
  const rowsTotal = useMemo(
    () => getTotalValue(headerRows, bodyRows),
    [headerRows, bodyRows],
  );
  const isShowingTotalSensible = headerRows.length + bodyRows.length > 1;
  const hasColorIndicators = useMemo(
    () => [...bodyRows, ...headerRows].some(row => row.color != null),
    [headerRows, bodyRows],
  );

  // For some charts such as PieChart we intentionally show only certain data rows that do not represent the full data.
  // In order to calculate percentages correctly we provide the grand total value
  const percentCalculationTotal = grandTotal ?? rowsTotal;

  const trimmedBodyRows = groupExcessiveTooltipRows(
    bodyRows,
    MAX_BODY_ROWS,
    hasColorIndicators ? color("text-light") : undefined,
  );

  return (
    <DataPointRoot>
      {headerTitle && (
        <DataPointHeader data-testid="tooltip-header">
          {headerTitle}
        </DataPointHeader>
      )}
      <DataPointTable>
        <DataPointTableHeader hasBottomSpacing={bodyRows.length > 0}>
          {headerRows.map((row, index) => (
            <TooltipRow
              key={index}
              isHeader
              percent={
                showPercentages ? getPercent(rowsTotal, row.value) : undefined
              }
              {...row}
            />
          ))}
        </DataPointTableHeader>

        {trimmedBodyRows.length > 0 && (
          <DataPointTableBody>
            {trimmedBodyRows.map((row, index) => (
              <TooltipRow
                key={index}
                percent={
                  showPercentages ? getPercent(rowsTotal, row.value) : undefined
                }
                {...row}
              />
            ))}
          </DataPointTableBody>
        )}

        {showTotal && isShowingTotalSensible && (
          <DataPointTableFooter>
            <TooltipTotalRow
              value={totalFormatter(rowsTotal)}
              hasIcon={hasColorIndicators}
              percent={
                showPercentages
                  ? getPercent(percentCalculationTotal, rowsTotal)
                  : undefined
              }
            />
          </DataPointTableFooter>
        )}
      </DataPointTable>
    </DataPointRoot>
  );
};

export default StackedDataTooltip;
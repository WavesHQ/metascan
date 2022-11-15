import Container from "@components/commons/Container";
import GradientCardContainer from "@components/commons/GradientCardContainer";
import LinkText from "@components/commons/LinkText";
import LinkTextWithIcon from "@components/commons/LinktextWithIcon";
import NumericFormat from "@components/commons/NumericFormat";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { SearchBar } from "layouts/components/searchbar/SearchBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCopy } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { DMX_TOKEN_SYMBOL } from "shared/contants";
import { secondsToDhmsDisplay } from "shared/durationHelper";
import { truncateTextFromMiddle } from "shared/textHelper";
import { transactions, pages } from "../../mockdata/TransactionData";
import BlockTransactionList from "./_components/BlockTransactionList";

// TODO: Replace `any` with proper types
interface Props {
  block: any;
  blockTransactions: any;
  pages: any;
}

export default function Blocks({ block, ...data }: Props) {
  const router = useRouter();
  const blockNumber = new BigNumber(router.query.id as string);
  const prevBlockNumber = blockNumber.minus(1);
  const nextBlockNumber = blockNumber.plus(1); // TODO: check if nextBlockNumber exists when api is readys

  return (
    <Container className="px-1 md:px-0 mt-12">
      <SearchBar containerClass="mt-1 mb-6" />
      <GradientCardContainer>
        <div className="px-5 py-8 md:p-10">
          <div className="mb-6">
            <h2 className="font-bold text-xl text-white-50">Block details</h2>
          </div>

          {/* Previous/Next buttons */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <LinkTextWithIcon
                href={`/blocks/${prevBlockNumber}`}
                label="Previous block"
                customStyle="text-xs"
                icon={{ Icon: FiArrowLeft, pos: "left", iconStyle: "pr-2" }}
              />
            </div>
            <div className="flex items-center">
              <LinkTextWithIcon
                href={`/blocks/${nextBlockNumber}`}
                label="Next block"
                customStyle="text-xs"
                icon={{ Icon: FiArrowRight, pos: "right", iconStyle: "pl-2" }}
              />
            </div>
          </div>

          {/* Block number, timestamp */}
          <div className="pt-6 pb-8 flex flex-col md:flex-row justify-between items-start">
            <div className="text-white-50 font-bold text-[32px]">
              <NumericFormat
                thousandSeparator
                value={blockNumber}
                decimalScale={0}
                prefix="#"
              />
            </div>
            <div className="flex flex-col items-start md:items-end pt-6 md:pt-0">
              <div className="text-white-50 font-bold">
                {block.transactionsPerBlock} Transactions
              </div>
              <div className="text-white-700 mt-1 flex flex-col md:flex-row">
                <span className="order-last md:order-first pt-1 md:pt-0">
                  {secondsToDhmsDisplay(block.time)} ago
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-black-600 pt-8 text-white-50 flex flex-col md:flex-row md:gap-5">
            <div className="w-full md:w-1/2">
              <FeeRecipientRow
                label="Fee recipient"
                feeRecipient={block.feeRecipient}
              />
              <DetailRow
                label="Reward"
                value={new BigNumber(block.rewardAmount).toFixed(8)}
              />
              <GasUsedRow
                label="Gas used"
                gasUsed={block.gasUsed}
                gasPercentage={block.gasPercentage}
              />
              <DetailRow
                label="Gas limit"
                value={block.gasLimit}
                decimalScale={0}
              />
            </div>
            <div className="w-full md:w-1/2">
              <DetailRow
                label="Base fee"
                value={new BigNumber(block.baseFee).toFixed(8)}
              />
              <DetailRow
                label="Burnt fee"
                value={new BigNumber(block.burntFee).toFixed(8)}
              />
            </div>
          </div>
        </div>
      </GradientCardContainer>

      {/* Block transaction list */}
      <div className="mt-6">
        <BlockTransactionList
          blockTransactions={data.blockTransactions}
          pages={data.pages}
        />
      </div>
    </Container>
  );
}

const style = {
  container: "flex gap-5 py-3 md:gap-0",
  labelWidth: "w-1/2 md:shrink-0 lg:w-1/3",
  valueWidth: "flex-1 text-right md:text-left",
};

function DetailRow({
  label,
  value,
  decimalScale = 8,
}: {
  label: string;
  value: string;
  decimalScale?: number;
}): JSX.Element {
  return (
    <div className={clsx(style.container)}>
      <div className={clsx("text-white-700", style.labelWidth)}>{label}</div>
      <div className={clsx("text-white-50", style.valueWidth)}>
        <NumericFormat
          thousandSeparator
          value={value}
          decimalScale={decimalScale}
          suffix={` ${DMX_TOKEN_SYMBOL}`}
        />
      </div>
    </div>
  );
}

function FeeRecipientRow({
  label,
  feeRecipient,
}: {
  label: string;
  feeRecipient: string;
}): JSX.Element {
  const { copy } = useCopyToClipboard();
  const [showCopyInfo, setShowCopyInfo] = useState(false);

  useEffect(() => {
    if (showCopyInfo) {
      setTimeout(() => setShowCopyInfo(false), 3000);
    }
  }, [showCopyInfo]);

  return (
    <div className={clsx("justify-between md:justify-start", style.container)}>
      <div className={clsx("text-white-700", style.labelWidth)}>{label}</div>
      {showCopyInfo ? (
        <div className="flex items-center">
          <span className="text-lightBlue">Copied!</span>
          <MdCheckCircle size={20} className="ml-2 text-green-800" />
        </div>
      ) : (
        <div className="flex">
          <LinkText
            testId="fee-recipient-mobile"
            href={`/addresses/${feeRecipient}`}
            label={truncateTextFromMiddle(feeRecipient, 4)}
            customStyle={clsx("inline-flex xl:hidden", style.valueWidth)}
          />
          <LinkText
            testId="fee-recipient-desktop"
            href={`/addresses/${feeRecipient}`}
            label={truncateTextFromMiddle(feeRecipient, 13)}
            customStyle={clsx("hidden xl:inline-flex", style.valueWidth)}
          />
          <FiCopy
            size={20}
            className="ml-2 self-center cursor-pointer"
            onClick={() => {
              copy(feeRecipient);
              setShowCopyInfo(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

function GasUsedRow({
  label,
  gasUsed,
  gasPercentage,
}: {
  label: string;
  gasUsed: number;
  gasPercentage: number;
}): JSX.Element {
  return (
    <div className={clsx(style.container)}>
      <div className={clsx("text-white-700", style.labelWidth)}>{label}</div>
      <div className={clsx(style.valueWidth)}>
        <div className="text-white-50">
          <NumericFormat
            thousandSeparator
            value={new BigNumber(gasUsed)}
            decimalScale={0}
          />
        </div>
        <div className="text-white-700 text-xs pt-1">{gasPercentage}%</div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // TODO: Fetch data from external API
  // TODO: Use mockdata from blocks list later
  const block = {
    blockNumber: 21002,
    transactionsPerBlock: 34,
    feeRecipient: "0xaab27b150451726ecsds38aa1d0a94505c8729bd1",
    time: 2040,
    datetime: "09/12/2023 12:45:23 PM + 7 UTC",
    rewardAmount: "120.324003",
    gasUsed: 12234,
    gasPercentage: 0.5,
    gasLimit: "40000000",
    baseFee: "0.00004242",
    burntFee: "0.13818798",
  };
  const blockTransactions = transactions;

  return { props: { block, blockTransactions, pages } };
}

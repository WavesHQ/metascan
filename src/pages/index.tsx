import TokenStatsDisplay from "@components/TokenStatsDisplay";
import { HomeTitle } from "@components/HomeTitle";
import { SearchBar } from "layouts/components/searchbar/SearchBar";
import GroupStatisticCard from "@components/GroupStatisticCard";
import LatestDataTable from "@components/LatestDataTable";
import LatestDataApi from "@api/LatestDataApi";

export default function Home() {
  const latestBlocks = LatestDataApi.useLatestBlocks();
  const latestTransactions = LatestDataApi.useLatestTransactions();

  return (
    <>
      <HomeTitle />
      <div className="px-1 md:px-0">
        <SearchBar containerClass="lg:px-[196px] my-10" />
        <TokenStatsDisplay />
        <GroupStatisticCard />
        <LatestDataTable
          type="transactions"
          title="Latest transactions"
          data={latestTransactions}
          listPageUrl="/txs"
          detailsPageBaseUrl="/tx"
          containerClass="pt-8 md:pt-20"
        />
        <LatestDataTable
          type="blocks"
          title="Latest blocks"
          data={latestBlocks}
          amountLabel="Reward"
          detailsPageBaseUrl="/block"
          listPageUrl="/blocks"
          containerClass="pt-5 md:pt-6 lg:pt-5"
        />
      </div>
    </>
  );
}

import React from "react";
import TodayItem from "./main2/TodayItem";
import NewItem from "./newItem/NewItem";
import MainBanner from "./banner/MainBanner";
import Banner from "./main2/Banner";
import Search from "./search/Search";

export default function Home() {
  return (
    <div>``````
      <MainBanner />
      <Search />
      <NewItem />
      <Banner />
      <TodayItem />
    </div>
  );
}

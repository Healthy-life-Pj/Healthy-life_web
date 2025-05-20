export interface ProductProps {
  id: number;
  title: string;
  image: string;
  price: number;
  tag: string[];
  view: number;
}

const products: ProductProps[] = [
  {
    id: 1,
    title: "Produt 3",
    image:
      "https://cdn.pixabay.com/photo/2016/10/23/09/37/fried-rice-1762493_1280.jpg",
    price: 20000,
    tag: ["볶음밥", "새우", "견과류"],
    view: 30,
  },
  {
    id: 2,
    title: "Produt 3",
    image:
      "https://cdn.pixabay.com/photo/2021/12/29/23/59/pineapple-fried-rice-6902993_1280.jpg",
    price: 20000,
    tag: ["볶음밥", "도시락"],
    view: 100,
  },
  {
    id: 3,
    title: "Produt 3",
    image:
      "https://cdn.pixabay.com/photo/2018/09/29/04/19/fried-rice-3710741_1280.jpg",
    price: 20000,
    tag: ["볶음밥", "도시락"],
    view: 130,
  },
  {
    id: 4,
    title: "Produt 4",
    image:
      "https://cdn.pixabay.com/photo/2021/05/31/01/10/fried-rice-6297406_1280.jpg",
    price: 30000,
    tag: ["볶음밥", "도시락"],
    view: 210,
  },
  {
    id: 5,
    title: "Produt 5",
    image:
      "https://cdn.pixabay.com/photo/2023/01/09/23/23/fried-rice-7708486_1280.jpg",
    price: 19900,
    tag: ["볶음밥", "도시락"],
    view: 11,
  },
  {
    id: 6,
    title: "Produt 6",
    image:
      "https://cdn.pixabay.com/photo/2019/12/20/17/05/fried-rice-4708866_1280.jpg",
    price: 22900,
    tag: ["볶음밥", "도시락"],
    view: 300,
  },
  {
    id: 7,
    title: "Produt 7",
    image:
      "https://cdn.pixabay.com/photo/2017/02/25/15/25/fried-rice-2098037_1280.jpg",
    price: 20500,
    tag: ["볶음밥", "도시락"],
    view: 150,
  },
  {
    id: 8,
    title: "Produt 8",
    image:
      "https://cdn.pixabay.com/photo/2018/11/10/00/38/fried-rice-3805769_1280.jpg",
    price: 25000,
    tag: ["볶음밥", "도시락"],
    view: 60,
  },
  {
    id: 9,
    title: "Produt 9",
    image:
      "https://cdn.pixabay.com/photo/2014/02/11/08/31/fried-rice-263882_1280.jpg",
    price: 25500,
    tag: ["볶음밥", "도시락"],
    view: 20,
  },
  {
    id: 10,
    title: "Produt 10",
    image:
      "https://cdn.pixabay.com/photo/2017/12/16/17/46/fried-rice-3023040_1280.jpg",
    price: 30000,
    tag: ["볶음밥", "도시락"],
    view: 25,
  },
  {
    id: 11,
    title: "Product 11",
    image:
      "https://cdn.pixabay.com/photo/2016/12/20/03/27/rice-ball-1919631_1280.jpg",
    price: 6000,
    tag: ["주먹밥", "도시락"],
    view: 22,
  },
  {
    id: 12,
    title: "Produt 12",
    image:
      "https://cdn.pixabay.com/photo/2017/01/11/08/33/rice-balls-1971148_1280.jpg",
    price: 8000,
    tag: ["주먹밥", "도시락"],
    view: 15,
  },
  {
    id: 13,
    title: "Produt 13",
    image:
      "https://cdn.pixabay.com/photo/2022/01/05/12/25/food-6917045_1280.jpg",
    price: 8000,
    tag: ["즉석밥", "도시락"],
    view: 20,
  },
  {
    id: 14,
    title: "Produt 14",
    image:
      "https://cdn.pixabay.com/photo/2013/11/12/06/47/dolsot-nutrition-rice-209200_1280.jpg",
    price: 8000,
    tag: ["즉석밥", "도시락"],
    view: 44,
  },
  {
    id: 15,
    title: "Produt 15",
    image: "https://cdn.pixabay.com/photo/2014/10/29/05/46/bob-507583_1280.jpg",
    price: 13500,
    tag: ["즉석밥", "도시락"],
    view: 65,
  },
  {
    id: 16,
    title: "Produt 16",
    image: "https://cdn.pixabay.com/photo/2014/10/29/05/46/bob-507583_1280.jpg",
    price: 7500,
    tag: ["즉석밥", "도시락"],
    view: 34,
  },
  {
    id: 17,
    title: "Produt 17",
    image: "",
    price: 9900,
    tag: ["즉석밥", "도시락"],
    view: 34,
  },
  {
    id: 18,
    title: "Produt 18",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 8400,
    tag: ["즉석밥", "도시락"],
    view: 34,
  },
  {
    id: 19,
    title: "Produt 19",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 5500,
    tag: ["즉석밥", "도시락"],
    view: 34,
  },
  {
    id: 20,
    title: "Produt 20",
    image:
      "https://cdn.pixabay.com/photo/2016/07/11/05/57/packed-korea-1509130_1280.jpg",
    price: 2400,
    tag: ["즉석밥", "도시락"],
    view: 340,
  },
  {
    id: 21,
    title: "Product 21",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 1200,
    tag: ["즉석밥", "도시락"],
    view: 50,
  },
  {
    id: 22,
    title: "Produt 22",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 8700,
    tag: ["즉석밥", "도시락"],
    view: 100
  },
  {
    id: 23,
    title: "Produt 23",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 4500,
    tag: ["즉석밥", "도시락"],
    view: 2
  },
  {
    id: 24,
    title: "Produt 24",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 8000,
    tag: ["주먹밥", "도시락"],
    view: 101
  },
  {
    id: 25,
    title: "Produt 25",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 8000,
    tag: ["주먹밥", "도시락"],
    view: 100
  },
  {
    id: 26,
    title: "Produt 26",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 8000,
    tag: ["주먹밥", "도시락"],
    view: 140
  },
  {
    id: 27,
    title: "Produt 27",
    image:
      "https://images.pexels.com/photos/17593637/pexels-photo-17593637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    price: 7500,
    tag: ["주먹밥", "도시락"],
    view: 140
  },
  {
    id: 28,
    title: "Produt 28",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 8000,
    tag: ["복음밥", "도시락"],
    view: 140
  },
  {
    id: 29,
    title: "Produt 29",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 3500,
    tag: ["복음밥", "도시락"],
    view: 140
  },
  {
    id: 30,
    title: "Produt 30",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 6000,
    tag: ["복음밥", "도시락"],
    view: 140
  },
  {
    id: 31,
    title: "Produt 31",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 10900,
    tag: ["볶음밥", "도시락"],
    view: 101
  },
  {
    id: 32,
    title: "Produt 32",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 20900,
    tag: ["볶음밥", "도시락"],
    view: 13
  },
  {
    id: 33,
    title: "Produt 33",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 15900,
    tag: ["볶음밥", "도시락"],
    view: 101
  },
  {
    id: 34,
    title: "Produt 34",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 11500,
    tag: ["볶음밥", "도시락"],
    view: 105
  },
  {
    id: 35,
    title: "Produt 35",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 13500,
    tag: ["볶음밥", "도시락"],
    view: 87
  },
  {
    id: 36,
    title: "Produt 36",
    image:
      "https://images.pexels.com/photos/9980875/pexels-photo-9980875.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    price: 11500,
    tag: ["볶음밥", "도시락"],
    view: 123
  },
  {
    id: 37,
    title: "Produt 37",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 21500,
    tag: ["볶음밥", "도시락"],
    view: 600
  },
  {
    id: 38,
    title: "Produt 38",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 11500,
    tag: ["볶음밥", "도시락"],
    view: 333
  },
  {
    id: 39,
    title: "Produt 39",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 33500,
    tag: ["볶음밥", "도시락"],
    view: 123
  },
  {
    id: 40,
    title: "Produt 40",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 14600,
    tag: ["볶음밥", "도시락"],
    view: 443
  },
  {
    id: 41,
    title: "Produt 41",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 11500,
    tag: ["볶음밥", "도시락"],
    view: 123
  },
  {
    id: 42,
    title: "Produt 42",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 11500,
    tag: ["볶음밥", "도시락"],
    view: 359
  },
  {
    id: 43,
    title: "Produt 43",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 19900,
    tag: ["볶음밥", "도시락"],
    view: 154
  },
  {
    id: 44,
    title: "Produt 44",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 11500,
    tag: ["즉석밥", "도시락"],
    view: 123
  },
  {
    id: 45,
    title: "Produt 45",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 11500,
    tag: ["볶음밥", "도시락"],
    view: 123
  },
  {
    id: 46,
    title: "Produt 46",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: 11500,
    tag: ["볶음밥", "도시락"],
    view: 123
  },
  {
    id: 47,
    title: "Produt 47",
    image:
      "https://cdn.pixabay.com/photo/2018/02/26/17/25/broccoli-3183560_1280.jpg",
    price: 11500,
    tag: ["닭가슴살", "닭"],
    view: 34
  },
  {
    id: 48,
    title: "Produt 48",
    image:
      "https://cdn.pixabay.com/photo/2022/07/25/20/15/grilled-chicken-7344499_1280.jpg",
    price: 4500,
    tag: ["닭가슴살", "닭"],
    view: 65
  },
  {
    id: 49,
    title: "Produt 49",
    image:
      "https://cdn.pixabay.com/photo/2014/03/05/01/20/chicken-breast-279847_1280.jpg",
    price: 11500,
    tag: ["닭가슴살", "닭"],
    view: 81
  },
  {
    id: 50,
    title: "Produt 50",
    image:
      "https://cdn.pixabay.com/photo/2022/11/06/13/29/turkey-breast-7574011_1280.jpg",
    price: 22500,
    tag: ["닭가슴살", "닭"],
    view: 81
  },
  {
    id: 51,
    title: "Produt 51",
    image:
      "https://cdn.pixabay.com/photo/2021/07/22/03/35/chicken-6484332_1280.jpg",
    price: 22500,
    tag: ["닭가슴살", "닭"],
    view: 90
  },
  {
    id: 52,
    title: "Produt 52",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 10000,
      tag: ["달걀", "닭"],
      view: 100
  },
  {
    id: 53,
    title: "Produt 53",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 22500,
      tag: ["달걀", "닭"],
      view: 181
  },
  {
    id: 54,
    title: "Produt 54",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 22500,
      tag: ["달걀", "닭"],
      view: 341
  },
  {
    id: 55,
    title: "Produt 55",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 22500,
      tag: ["달걀", "닭"],
      view: 510
  },
  {
    id: 56,
    title: "Produt 56",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 11500,
      tag: ["달걀", "닭"],
      view: 67
  },
  {
    id: 57,
    title: "Produt 57",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 10500,
      tag: ["달걀", "닭"],
      view: 7
  },
  {
    id: 58,
    title: "Produt 58",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 10500,
      tag: ["달걀", "닭"],
      view: 7
  },
  {
    id: 59,
    title: "Produt 59",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 2400,
      tag: ["달걀", "닭"],
      view: 37
  },
  {
    id: 60,
    title: "Produt 60",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 7100,
      tag: ["달걀", "닭"],
      view: 12
  },
  {
    id: 61,
    title: "Produt 61",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 7100,
      tag: ["달걀", "닭"],
      view: 15,
  },
  {
    id: 62,
    title: "Produt 62",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
      price: 7100,
      tag: ["소고기", "닭","소고기"],
      view: 14,
  },
];

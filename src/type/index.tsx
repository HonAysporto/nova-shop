export type productsType = {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  }
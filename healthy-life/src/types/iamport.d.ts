export {};

declare global {
  interface Window {
    IMP?: {
      init: (code: string) => void;
      request_pay: (
        params: {
          pg?: string;
          pay_method?: string;
          merchant_uid: string;
          name?: string;
          amount: number;
          buyer_name?: string;
          buyer_tel?: string;
        },
        callback: (rsp: any) => void
      ) => void;
    };
  }
}

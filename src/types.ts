interface ProductType {
    id: string,
    active: boolean,
    default_price: string,
    description: string,
    metadata: {},
    name: string,
    attributes: [],
    created: number,
    images: string[],
    livemode: boolean,
    object: "product",
    package_dimensions: null,
    shippable: null,
    statement_descriptor: null,
    tax_code: null,
    type: "service",
    unit_label: null,
    updated: number,
    url: null
};

interface UserType {
    id: string,
    imgUrl: string,
    phone: string | null,
    email: string | null
    name: string | null
}

interface CartItem extends ProductType {
    qty: number,
}

interface CartType {
    [prodId:string]: CartItem
}

export type {
    ProductType,
    UserType,
    CartType
}
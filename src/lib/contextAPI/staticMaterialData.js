export const orderMaterialStatic = () => {
    
    const orderMaterial = {
        material_code: "",
        material_id: "",
        material_name: "",
        division_id: "",
        division_name: "",
        uom: "",
        batch_number: "",
        batch_id: "",
        batch_list: [],
        free_stock: 0,
        new_batch_value: false,
        hsn_code: "",
        material_qty: "",
        base_value: "",
        mrp_price: "",
        invoice_discount: 0,
        other_discount: 0,
        invoice_discount_per: 0,
        other_discount_per: 0,
        cgst_rate: "",
        cgst_value: "",
        sgst_rate: "",
        sgst_value: "",
        cess_rate: "",
        cess_value: "",
        additional_cess_rate: "",
        additional_cess_value: "",
        total_tax: "",
        tcs_rate: "",
        tcs_value: "",
        total_payable: "",
    }

    return { ...orderMaterial };
};

export const CashDeminationStatic = () => {

    const cashType = [
        {
            id: 9,
            label: 1,
            value: '',
            total: 0,
            cash_type: 'Coins'
        },
        {
            id: 10,
            label: 2,
            value: '',
            total: 0,
            cash_type: 'Coins'
        }, {
            id: 1,
            label: 5,
            value: '',
            total: 0,
            cash_type: 'Coins'
        }, {
            id: 2,
            label: 10,
            value: '',
            total: 0,
            cash_type: 'Coins'
        }, {
            id: 3,
            label: 20,
            value: '',
            total: 0,
            cash_type: 'Coins'
        }, {
            id: 12,
            label: 10,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 13,
            label: 20,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 4,
            label: 50,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 5,
            label: 100,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 6,
            label: 200,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 7,
            label: 500,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }]
        
    return cashType;
};

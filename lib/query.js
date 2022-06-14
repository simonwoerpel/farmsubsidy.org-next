const QUERY = {
    recipient_name__null: false,
    amount__null: false,
};

export const getCountryQuery = (query) => ({ ...QUERY, ...query });

export const getYearQuery = (query) => ({ ...QUERY, ...query });

export const getSchemeQuery = (query) => ({
    ...QUERY,
    scheme_id__null: false,
    ...query,
});

export const getRecipientQuery = (query) => ({ ...QUERY, ...query });

export const getLocationQuery = (query) => ({ ...QUERY, ...query });

export const getPaymentQuery = (query) => ({ ...QUERY, ...query });

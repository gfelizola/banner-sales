const {
    VENDAS_DEPT,
    TITLE
} = require('./constants');

const bannerTemplate = userId =>  ({
    "depts": [
        {
            "dept": VENDAS_DEPT,
            "messages": [
                {
                    "title": {
                        "text": TITLE
                    },
                    "closable": "false",
                    "notification_type": "Template-02",
                    "description": [
                        {
                            "text": "- Os dados da sua empresa e do seu produto ficam salvos para que você ganhe agilidade nas próximas vendas."
                        },
                        {
                            "text": "- Enviamos a NF-e por e-mail para o comprador que a solicitou."
                        }
                    ],
                    "priority": 1,
                    "images": [
                        {
                            "url": "https://http2.mlstatic.com/resources/frontend/statics/swift-uploader/1.0/nf_icon.png"
                        }
                    ],
                    "due_date": "2017-12-31T23:59:00.000-03:00",
                    "since": "2017-11-24T00:00:00.000-03:00",
                    "optional_action": {
                        "data": {
                            "action": `https://myaccount.mercadolivre.com.br/invoices/emitir-nota-fiscal?cust_id=${userId || ''}`
                        },
                        "label": "Saiba mais sobre essa novidade"
                    },
                    "scope": {
                        "type": "user",
                        "value": userId
                    }
                }
            ]
        }
    ]
});

module.exports = bannerTemplate;
import { ColumnBreak, WidthType, BorderStyle, Paragraph, Packer, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, Document, PageBreak, ShadingType } from "docx";
import { saveAs } from 'file-saver';
import React, { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import './App.css'
import fs from "fs";

const arrs = [[
  {
    "id": 863321,
    "description": "Efficia CM120",
    "quantity": 2
  },
  {
    "id": "863321_B01",
    "description": "B01 Philips SPO2",
    "quantity": 2
  },
  {
    "id": "863321_A01",
    "description": "A01 Adult Accessory Kit",
    "quantity": 2
  },
  {
    "id": "863321_B10",
    "description": "B10 Two IBP",
    "quantity": 2
  },
  {
    "id": "863321_B21",
    "description": "B21 etCO2 Capnostat",
    "quantity": 2
  },
  {
    "id": "863321_C15",
    "description": "C15 Full disclosure",
    "quantity": 2
  },
  {
    "id": "863321_C01",
    "description": "C01 Philips Arrhythmia Advance",
    "quantity": 2
  },
  {
    "id": "863321_C04",
    "description": "C04 Assisting Venous Puncture",
    "quantity": 2
  },
  {
    "id": "863321_C06",
    "description": "C06 Hemo Calculator",
    "quantity": 2
  },
  {
    "id": "863321_C08",
    "description": "C08 Barcode support",
    "quantity": 2
  },
  {
    "id": "863321_E10",
    "description": "E10 Internal recorder",
    "quantity": 2
  },
  {
    "id": "863321_E12",
    "description": "E12 9 Cell Lithium Ion",
    "quantity": 2
  },
  {
    "id": "863321_B07",
    "description": "B07 12 lead ECG",
    "quantity": 2
  },
  {
    "id": "863321_B30",
    "description": "B30 Cardiac output",
    "quantity": 2
  },
  {
    "id": 989803160641,
    "description": "Efficia 3/5 ECG Trunk Cable  AAMI/IEC",
    "quantity": 2
  },
  {
    "id": "989803160691",
    "description": "Efficia 5-Lead Grabber Limb  AAMI",
    "quantity": 2
  },
  {
    "id": "21078A",
    "description": "Skin Surface Temperature Probe",
    "quantity": 4
  },
  {
    "id": "M1191BL",
    "description": "Reusable Adult SpO2 Sensor",
    "quantity": 2
  },
  {
    "id": "M1575A",
    "description": "Reusable NIBP Comfort Cuff/large adult",
    "quantity": 4
  },
  {
    "id": "PR-00001015928",
    "description": "SENSOR DE CO2 CAPNOSTAT 5",
    "quantity": 2
  },
  {
    "id": "NV-7007-01",
    "description": "ADAPTADOR VIAS AÉREAS ADULTO/PED.  REUT. (TUBO ET >4mm)",
    "quantity": 4
  },
  {
    "id": "NV-7053-01",
    "description": "ADAPTADOR VIAS AÉREAS NEO/PED.  REUT. (TUBO ET <4mm)",
    "quantity": 4
  },
  {
    "id": "M1642A",
    "description": "CBL Cardiac Output Cable",
    "quantity": 2
  }
], [
  {
    "id": "866199",
    "description": "DFM100 Defibrillator Monitor",
    "quantity": 2
  },
  {
    "id": "866199_X00",
    "description": "X00 Hospital Device",
    "quantity": 2
  },
  {
    "id": "866199_C14",
    "description": "C14 3-lead Snap ECG",
    "quantity": 2
  },
  {
    "id": "866199_C01",
    "description": "C01 External Paddles with PCI",
    "quantity": 2
  },
  {
    "id": "866199_B01",
    "description": "B01 External Pacing",
    "quantity": 2
  },
  {
    "id": "866199_B02",
    "description": "B02 AED Mode",
    "quantity": 2
  },
  {
    "id": "989803190381",
    "description": "Efficia 50mm Chem Therm Paper  No Lines",
    "quantity": 2
  }
]]


function App() {
  const [rows, setRows] = useState([]);
  const [paymentCondition, setPaymentCondition] = useState('');

  function convertExcelToJson(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log(jsonData); // Output the JSON data to the console
    };

    reader.readAsBinaryString(file);
  }
  const paymentConditionsList = [
    'INDENT DX   100% ANTECIPADO',
    'INDENT DX  100% ANTECIPADO (2X)',
    'DIRETO COM A PHILIPS   100% ANTECIPADO (sem sinal) ',
    'DIRETO COM A PHILIPS  100% ANTECIPADO (2X)',
    'DIRETO COM A PHILIPS  30 DDF',
    'DIRETO COM A PHILIPS  30 / 60 DDF ',
    'DIRETO COM A PHILIPS  A PARTIR DE 2X',
    'DIRETO COM A PHILIPS  ENTRADA + 1X',
    'DIRETO COM A PHILIPS  ENTRADA + A PARTIR DE 2X',
    'FINANCIAMENTO BANCÁRIO  (Santander/Bradesco/DLL/Banco do Brasil/Unicred)  100% FINANCIADO',
    'FINANCIAMENTO BANCÁRIO   (Santander/Bradesco/DLL/Banco do Brasil/Unicred)  ENTRADA + FINANCIAMENTO',
    'FINANCIAMENTO BANCÁRIO   (BNB/Proger/Leasing/FCO/FNE/ Banco do Nordeste)  100% FINANCIADO',
    'FINANCIAMENTO BANCÁRIO   (BNB/Proger/Leasing/FCO/FNE/ Banco do Nordeste)  ENTRADA + FINANCIAMENTO',
    'CARTÃO DE CRÉDITO  100% VIA CARTÃO DE CRÉDITO (TODAS AS BANDEIRAS) * Mencionar o nº de parcelas, limitado ao máximo de 12 parcelas.'
  ]
  function separateFromList(extractPaymentCondition) {
    let foundString = null;

    for (let i = 0; i < paymentConditionsList.length; i++) {
      if (paymentConditionsList[i].includes(extractPaymentCondition)) {
        foundString = paymentConditionsList[i];
        break;
      }
    }
    return foundString;
  }
  
  function extractPaymentCondition(jsonData) {
    const row = jsonData.find(row => row['__EMPTY_2'] === 'Cond. Pagto')
    const paymentCondition = row['__EMPTY_3'];
    const splitCondition = paymentCondition.split(/[\(\)]/).map(s => s.trim())
    let multiplier = parseInt(splitCondition[0].replace('x', ''));
    let extractPaymentCondition = splitCondition[1]

    let foundString = separateFromList(extractPaymentCondition);

    console.log(foundString);
    console.log(multiplier, extractPaymentCondition)
    return paymentCondition;
  }

  const objWithPaymentCondition = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    const paymentConditionValue = extractPaymentCondition(jsonData);
    setPaymentCondition(paymentConditionValue);
  }

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        objWithPaymentCondition(event);
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const [sheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets?.[sheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const filteredRows = rawRows.filter((row) =>
          row.includes("Indicar com X")
        );
        const [firstRow] = filteredRows;
        const startIndex = firstRow ? rawRows.indexOf(firstRow) + 1 : 0;
        const filteredContents = rawRows.slice(startIndex).filter((row) => row[0]);

        // Transform each item inside transformedRows to the desired format
        const transformedRows = filteredContents.reduce((acc, row) => {
          if (row[0] && row[0][0] === ".") {
            if (acc.tempRow.length > 0) {
              const transformedItems = acc.tempRow.map((item) => ({
                id: item[2],
                description: item[3],
                quantity: item[5],
              }));
              acc.joinedRows.push(transformedItems);
              acc.tempRow = [];
            }
          } else {
            acc.tempRow.push(row);
          }
          return acc;
        }, { tempRow: [], joinedRows: [] });

        if (transformedRows.tempRow.length > 0) {
          const transformedItems = transformedRows.tempRow.map((item) => ({
            id: item[2],
            description: item[3],
            quantity: item[5],
          }));
          transformedRows.joinedRows.push(transformedItems);
        }

        setRows(transformedRows.joinedRows);
      } catch (error) {
        console.error(error);
        setRows([]);
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const createTable = (arrs) => {
    const rows = arrs.flatMap((items) => {
      return items.map((item) => {
        const { id, description, quantity } = item;
        const cells = [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${id}`,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: description,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${quantity}`,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        ];

        return new TableRow({ children: cells });
      });
    });

    return new Table({
      rows,
      width: {
        size: 8000,
        type: WidthType.DXA,
      },
    });
  };

  const teste = (items) => {
    const rows = items.map((item) => {
      const { id, description, quantity } = item;
      const cells = [
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${id}`,
                  bold: true,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: description,
                  bold: true,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${quantity}`,
                  bold: true,
                }),
              ],
            }),
          ],
        }),
      ];

      return new TableRow({ children: cells });
    });

    return new Table({
      rows,
      width: {
        size: 8000,
        type: WidthType.DXA,
      },
    });
  };

  const startPdf = () => {

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: "my-crazy-numbering",
            levels: [
              {
                level: 1,
                format: "decimal",
                text: "%2.",
                alignment: AlignmentType.START,
                style: {
                  paragraph: {
                    indent: { left: 1440, hanging: 980 },
                  },
                },
              },
              {
                level: 5,
                format: "decimal",
                text: "%2.",
                alignment: AlignmentType.START,
                style: {
                  paragraph: {
                    indent: { left: 1440, hanging: 980 },
                  },
                },
              },
              {
                level: 3,
                format: "decimal",
                text: "%2.",
                alignment: AlignmentType.START,
                style: {
                  paragraph: {
                    indent: { left: 1440, hanging: 980 },
                  },
                },
              },
              {
                level: 7,
                format: "decimal",
                text: "%2.",
                alignment: AlignmentType.START,
                style: {
                  paragraph: {
                    indent: { left: 1440, hanging: 980 },
                  },
                },
              },
            ],
          },
        ],
      },
      sections: [{
        children: [
          new Paragraph({
            text: "PHILIPS MEDICAL SYSTEMS LTDA.,",
            spacing: {
              after: 200
            },
            wordWrap: true,
            //heading: HeadingLevel.HEADING_1,
            bold: true,
            children: [
              new TextRun({
                text: "sociedade empresária limitada, inscrita no CNPJ/MF sob o nº 58.295.213/0001-78, com sede na Avenida Julia Gaiolli, nº 740, Galpão T300, Parte S5, Água Chata, no Município de Guarulhos, Estado de São Paulo, CEP 07251-500, com estabelecimentos no Município de Varginha, Estado de Minas Gerais, à Av. Otto Salgado, 250, Distrito Industrial Cláudio Galvão Nogueira, CEP: 37.066-440, inscrita no CNPJ/MF sob o nº 58.295.213/0021-11, e no Município de Extrema, Estado de Minas Gerais, à Rod. Fernão Dias, S/N - KM 947.4 Galpão CD4 Módulo B, Distrito Dos Pires, CEP: 37.640-000, inscrita no CNPJ/MF sob o nº. 58.295.213/0023-83.",
              })
            ]
          }),
          new Paragraph({
            text: "HPM&EC_Prop.N° XXXXX            São Paulo, 17 de março de 2023                 OPP/GID: XXXXX",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "CLIENTE:            TÍTULO:              CNPJ:             ENDEREÇO*:            XXXX / SC – CEP: XXXX             *Endereço para Faturamento",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Prezados Senhores (as),",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Temos o prazer de encaminhar Proposta-Contrato emitida pela PHILIPS MEDICAL SYSTEMS LTDA. para fornecimento do(s) Equipamento (s):",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Seguem como parte integrante desta: Especificações Técnicas, Termos e Condições Gerais de Venda e Anexos.",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Atenciosamente,",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "ILHATEC COMÉRCIO DE EQUIPAMENTOS MÉDICO-HOSPITALARES LTDA,",
            bold: true,
            spacing: {
              after: 200
            },
            children: [
              new TextRun({
                text: "REPRESENTANTE AUTORIZADO / KEY ACCOUNT MANAGER 400949940"
              })
            ]
          }),
          new Paragraph({
            text: "“DE ACORDO”",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "------------------- Tabela dos itens -------------------",
            spacing: {
              after: 200
            }
          }),
          rows.forEach(row => teste(row)),
          //createTable(rows),
          new Paragraph({
            text: "RESPONSABILIDADES ENTRE COMPRADORA E VENDEDORA",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "O referido preço LOCAL inclui as despesas, taxas e demais impostos descritos nos “Termos e Condições Gerais da Venda.” O COMPRADOR deve fornecer a energia elétrica, local para instalação do equipamento e os dispositivos necessários para a proteção do sistema e de suas diversas partes, no que diz respeito ao suprimento de energia e local de instalação, de acordo com as características técnicas do Equipamento indicadas pela VENDEDORA via caderno de projetos e especificações.",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "CONDIÇÃO DE PAGAMENTO",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "XXXXXX AQUI TE EXPLICO EM OUTRA CALL",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Obs: Esta condição de pagamento estará sujeita a análise de crédito da Philips.             Na hipótese de não aprovação esta proposta-contrato estará imediatamente cancelada, sem penalidade as partes.            As partes poderão acordar uma nova forma de pagamento, a qual deverá ser formalizada em nova proposta assinada.",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "PRAZO DE ENTREGA",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Para o fornecimento LOCAL (Vendas em Reais), a Philips se compromete a entregar o Equipamento nos prazos de 180 (cento e oitenta) dias (exceto os equipamentos citados abaixo) no local de instalação, após o recebimento de uma via original da presente Proposta-Contrato devidamente assinada pelo COMPRADOR, bem como concluídas as seguintes condições, quando aplicáveis: aprovação de crédito; comprovação do pagamento do sinal ou do valor integral; carta de aprovação de produção; local de instalação devidamente preparado pelo COMPRADOR.",
            spacing: {
              after: 200
            }
          }),

          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "Equipamenos",
                          bold: true
                        })
                      ]
                    })],
                    shading: {
                      fill: "c7c6c1",
                      type: ShadingType.CLEAR,
                      color: "auto",
                    },
                  }),

                  new TableCell({
                    children: [new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "Prazo de entrega",
                          bold: true
                        })
                      ]
                    })],
                    shading: {
                      fill: "c7c6c1",
                      type: ShadingType.CLEAR,
                      color: "auto",
                    },
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Expression Patient Monitor (MR400) ')]
                  }),
                  new TableCell({
                    children: [new Paragraph('280 (duzentos e oitenta) dias após a assinatura do contrato.')]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('FM20 / VS30 ')]
                  }),
                  new TableCell({
                    children: [new Paragraph('140 (cento e quarenta) dias após a assinatura do contrato.')]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Linha EFFICIA / PageWriter TC10 Cardiograph ')]
                  }),
                  new TableCell({
                    children: [new Paragraph('90 (noventa) dias após a assinatura do contrato.')]
                  })
                ]
              }),
            ],
            width: {
              size: 8000,
              type: WidthType.DXA,
            }
          }),
          new Paragraph({
            text: "------------------- Tabela prazo entrega -------------------",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Em razão da afetação das cadeias globais de suprimentos decorrentes de fatores externos ao controle da VENDEDORA, ocasionados por eventos considerados como força maior, tais como a COVID-19 e suas sub-variantes, crise global de condutores e semi-condutores, guerras, paralisações e outros, a VENDEDORA se compromete a envidar todos os esforços para cumprir o prazo constante no Anexo I, entretanto, tal prazo se trata de uma estimativa, podendo sofrer alterações em seu cronograma, as quais serão devidamente justificadas pela VENDEDORA mediante comunicação prévia à COMPRADORA. Assim, as Partes acordam que caso a VENDEDORA não consiga despachar o(s) Equipamento(s) para seu destino na data agendada, devido a razões fora do seu controle razoável, a mesma não será responsabilizada nem incorrerá em multa.",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Na hipótese de alteração do prazo estabelecido acima, por um período superior a 180 (cento e oitenta) dias, as condições contratuais poderão ser revistas pela Philips.            ",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "FRETE E SEGURO – Transporte Local",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "A despesa de frete e seguro para o transporte do equipamento do local de desembaraço ou da sede da Philips Medical Systems até a clínica do Comprador, é de responsabilidade da Vendedora. ",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "LOCAL DE ENTREGA",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "O mesmo do faturamento.       ",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "INSTALAÇÃO & TREINAMENTO",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Os preços ofertados incluem custos de instalação apenas em projetos com Central. A PMS LTDA informará os pré-requisitos necessários após a confirmação do pedido de compra.            Estão inclusos nesta oferta os custos de treinamento operacional para uso e funcionamento do equipamento, com duração máxima de dois dias, com três turnos em horário comercial. ",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "UTILIZAÇÃO DO EQUIPAMENTO",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "O COMPRADOR, através desta proposta, afirma expressamente que os Equipamentos médicos a serem adquiridos junto à Philips serão operados:            a.	 Em estabelecimento que possui Alvará Sanitário vigente e que atende a todos os demais requisitos legais e regulatórios conforme determinações da ANVISA, do Ministério da Saúde e outros órgãos competentes;            b.	 Por profissionais competentes e habilitados para tal operação, que atuarão sob a tutela do Responsável Técnico indicado pelo COMPRADOR, sendo que todas as recomendações/obrigações da Legislação Brasileira devem ser atendidas.            ",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "GARANTIA",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Os equipamentos fabricados pela Philips Medical Systems – Nederland B.V. (“PHILIPS”) ou Philips Medical Systems Ltda., são garantidos contra defeitos e/ou falhas que, sob condições adequadas de uso, manutenção e operação, ocorram devido a eventual defeito de fabricação ou de material utilizado para a sua confecção pelo prazo de 12 (doze) meses , contados da data da respectiva aceitação dos referidos equipamentos pela COMPRADORA, através da Ata de Instalação ou 15 (quinze) meses da data do faturamento ou da data de despacho no exterior, o que ocorrer primeiro.            Quando contratada pela COMPRADORA a garantia estendida, esta, vigerá conforme os termos e condições da Proposta Comercial vinculada a este instrumento.                            • Esta proposta contempla 12 (doze) meses de garantia estendida, resultando no período total de 24 (vinte e quatro) meses de garantia. Exceto para os acessórios que possuem prazo total de 90 (noventa) dias de garantia.                 • Esta proposta contempla PEGAR VALOR DA CÉLULA 2-D DA MATRIZ (POR EXTENSO) meses de garantia estendida, resultando no período total de SOMAR O VALOR DA CÉLULA 2-D DA MATRIZ POR 12, EX: 12+12 (POR EXTENSO) meses de garantia. Exceto para os acessórios que possuem prazo total de 90 (noventa) dias de garantia. ",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "NOTAS",
            thematicBreak: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Não estão inclusos nenhum tipo de mobiliários fora os expressamente descritos na proposta.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 7,
            },
          }),
          new Paragraph({
            text: "  Para pedidos com valores acima de R$ 300.000,00 (Pessoa Jurídica) serão necessários os seguintes documentos para análise de crédito e para a finalização do pedido de venda:            • Demonstrativos financeiros (Balanço Patrimonial ou balancete e DRE – Demonstração de Resultado*) dos últimos 3 (três) exercícios;             • Contrato Social e alterações contratuais ou Estatuto Social e Ata de Assembléia que elegeu a atual diretoria;            • Relação de faturamento mensal dos últimos 12 meses;            • Quando não houver demonstrativos financeiros solicitar a DIRPFJ (Declaração de Imposto de Renda dos Sócios), ou outro documento que comprove capacidade econômica e financeira.             • Proposta ou contrato padrão de compra e venda de equipamento pela área Legal A(S) VENDEDORA(S) independente da condição de pagamento. (*)        (*) o draft do contrato é enviado para análise do cliente após a aprovação da proposta comercial. ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 7,
            },
          }),
          new Paragraph({
            text: " Sobre os acessórios/equipamentos comprados, o cliente se compromete com os seguintes pontos:            • Os mesmos não podem ser revendidos, emprestados, doados ou de qualquer outro modo comercializados para quaisquer terceiros;            • Eles devem ser utilizados por pessoas devidamente capacitadas;            • O cliente deve garantir a rastreabilidade dos mesmos.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 7,
            },
          }),
          new Paragraph({
            text: "A COMPRADORA entende e concorda que, em caso de entrega parcial do equipamento e acessórios, a COMPRADORA deverá efetuar tempestivamente o pagamento das faturas referentes aos itens já entregues. Dessa forma, a COMPRADORA está ciente e de acordo que no caso de faturamento de acessórios em separado do equipamento, tais faturas deverão ser pagas conforme a sua emissão e independentemente da entrega do equipamento e/ou outros acessórios.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 7,
            },
          }),
          new Paragraph({
            text: "Caso o equipamento seja adquirido para uso veterinário, a COMPRADORA está ciente e concorda que esta deverá ser sua única destinação, sendo expressamente vedado o uso para outros fins.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 7,
            },
          }),
          new Paragraph({
            text: "ASSISTÊNCIA TÉCNICA",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Permanente, prestada exclusivamente pela equipe de Serviços da Philips/Dixtal em São Paulo ou em um representante autorizado.",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "A Philips oferece 'Contrato de Manutenção' para todos os equipamentos de sua fabricação. ",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "OBSERVAÇÕES",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "N/A.      ",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "VALIDADE DO PREÇO E DA PROPOSTA",
            thematicBreak: true,
            bold: true,
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "Após 30 (trinta) dias corridos, a contar da data de emissão desta proposta-contrato, a Philips se reserva o direito de cancelar a mesma, caso não a tenha recebido devidamente assinada pelo COMPRADOR.",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "• A validade desta Proposta-Contrato é condicionada à comprovação pela COMPRADORA de sua regularidade sanitária, por meio da apresentação de Alvará Sanitário, Licença e/ou documento equivalente. Essa condição não é aplicável para aquisições realizadas por pessoas físicas.",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "TERMOS E CONDIÇÕES GERAIS DE VENDA PHILIPS",
            heading: HeadingLevel.HEADING_2,
            bold: true,
          }),
          new Paragraph({
            text: "As presentes Condições Gerais de Venda (“Condições de Venda”) regulam as relações comerciais cujo objeto seja a venda de equipamentos e/ou produtos (“FORNECIMENTO”), conforme estabelecido na Proposta Técnica e Comercial e anexos entre a PHILIPS MEDICAL SYSTEMS LTDA. (“Philips” ou “CONTRATADA”) e o COMPRADOR“COMPRADOR).",
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: "VALIDADE DA PROPOSTA E DAS CONDIÇÕES DE VENDA",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            },
            children: [
              new TextRun({
                text: "A proposta da Philips terá validade pelo prazo nela declarado, sujeita a alteração ou cancelamento pela Philips antes da data de aceitação do COMPRADOR e estará condicionada à revisão e à aprovação de crédito pela Philips ou pelo Agente Financeiro designado pelo COMPPRADOR, cuja análise em tempo hábil dependerá do recebimento da documentação pertinente ao COMPRADOR. Quaisquer pedidos do COMPRADOR, sejam ou não oriundos da proposta da Philips ou realizados após a expiração do prazo, estarão sujeitos à confirmação por escrito da Philips.",
                numbering: {
                  reference: "my-crazy-numbering",
                  level: 1,
                },
              }),
              new TextRun({
                text: "A validade desta Proposta-Contrato é condicionada à comprovação pela COMPRADORA de sua regularidade sanitária, por meio da apresentação de Alvará Sanitário, Licença e/ou documento equivalente. Essa condição não é aplicável para aquisições realizadas por pessoas físicas.",
              }),
              new TextRun({
                text: "Quaisquer termos e condições previstos no Pedido de Compra ou outros documentos expedidos pelo COMPRADOR, são, neste ato, integralmente rejeitados e não serão aplicáveis ao FORNECIMENTO, a menos e na medida que expressamente for declarada de outro modo, por escrito, na proposta da Philips.",
              }),
              ,
              new TextRun({
                text: "Na hipótese de divergência na interpretação ou aplicação dos documentos que fazem parte do FORNECIMENTO, observar-se-á a seguinte ordem de prevalência: proposta, Condições de Venda, anexos e Pedido de Compra. ",
              }),
            ],
          }),
          new Paragraph({
            text: "PREÇO E REAJUSTE",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "O preço do FORNECIMENTO inclui todos os impostos incidentes sobre a compra e venda, incluindo, mas não se limitando, ao imposto sobre Equipamentos industrializados (IPI) e ao Imposto sobre a Circulação de mercadoria (ICMS) e será reajustado observando-se a periodicidade mínima permitida pela legislação em vigor na data de cada pagamento. Caso sejam criados novos tributos ou ocorra alteração de alíquota dos tributos existentes, o preço do FORNECIMENTO a ser faturado refletirá tais modificações, a fim de que seja mantido o equilibro econômico-financeiro entre as partes.",
              }),
              new TextRun({
                text: "O preço inclui todas as despesas de frete e seguro relativos ao transporte dos equipamentos do FORNECIMENTO, até o local de instalação, salvo se estes custos estiverem excluídos do preço da proposta. Não estão contemplados eventuais custos relativos a transporte vertical (guindaste), andaimes e/ou reforço estrutural, os quais são de responsabilidade do COMPRADOR, salvo se expresso em contrário na proposta.",
              }),
              new TextRun({
                text: "Quaisquer modificações solicitadas por escrito pelo COMPRADOR e aprovadas pela Philips ou decorrentes de alteração na legislação, nas normas técnicas ou solicitação de autoridades competentes, que gerarem impacto nas quantidades e/ou características do FORNECIMENTO ou ainda nas condições de sua execução, ensejarão na readequação proporcional do preço e prazos do FORNECIMENTO.",
              }),
              new TextRun({
                text: "Se, por qualquer motivo, houver impossibilidade de aplicação do índice de reajuste definido na Proposta, o reajuste do preço será feito com base no índice que vier a substituí-lo e que reflita a real variação dos custos do FORNECIMENTO.",
              }),
            ]
          }),

          new Paragraph({
            text: "CONDIÇÕES DE PAGAMENTO",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            },
            children: [
              new TextRun({
                text: "O pagamento do FORNECIMENTO deverá ser efetuado de acordo com as condições de pagamento estipuladas na proposta."
              }),
              new TextRun({
                text: "Toda e qualquer importância que deixar de ser paga pelo COMPRADOR na respectiva data de vencimento, será cobrada com acréscimo de juros de mora de 1% (um por cento) ao mês, pro rata die, além de multa moratória de 10% (dez por cento), calculada sobre o montante em atraso, sem prejuízo da possibilidade da Philips suspender o FORNECIMENTO até que a situação seja regularizada, de forma que os prazos de entrega serão automaticamente prorrogados pelo mesmo período que perdurar a suspensão, ou, ainda, deduzir o valor não pago de qualquer outro acordo celebrado entre Philips e o COMPRADOR."
              }),
              new TextRun({
                text: "Além das disposições previstas acima, a Philips poderá tomar as medidas legais cabíveis para entrar em quaisquer dependências nas quais os equipamentos objetos do FORNECIMENTO possam ser encontrados e torná-los inoperáveis ou removê-los, bem como retê-los e vendê-los de acordo com as leis aplicáveis. Em qualquer ação instaurada para executar estas Condições de Venda após o inadimplemento do COMPRADOR ou de outra forma, a Philips terá o direito de reaver, como parte de seus danos, todos os custos e despesas, inclusive honorários advocatícios razoáveis, com relação a essa ação."
              }),
              new TextRun({
                text: "Nos casos cujo pagamento for parcelado, a Philips poderá, ainda:                       Declarar todas as obrigações não pagas imediatamente devidas e exigíveis, pelo que todas as parcelas vencidas ou vincendas sob esta Condição de Venda, tornar-se-ão imediatamente devidas e exigíveis, após o recebimento, pelo COMPRADOR, de Notificação Extrajudicial em tal sentido;                      Requerer que o COMPRADOR reúna os equipamento objeto do FORNECIMENTO e os deixem disponíveis para a Philips ou seus representantes, em qualquer local convenientemente designado pela Philips;                      Exercer qualquer outro direito ou fazer uso de qualquer outro recurso que possa estar disponível para a Philips, na forma da lei pertinente, procedimentos judiciais apropriados para executar os termos destas Condições de Venda ou de qualquer garantia estabelecida em conexão com estas Condições de Venda, ser indenizada por danos causados pela violação destas Condições de Venda, ou, ainda, rescindir estas Condições de Venda.                      "
              }),
              new TextRun({
                text: "Financiamento Bancário: na hipótese de Financiamento Bancário, se porventura o COMPRADOR não obter ou possuir aprovação para o financiamento, conforme previsto no item 1.1 supra, deverá cumprir com o pagamento integral a Philips, em 01 (uma) parcela, através de recursos próprios, antecipadamente a data do faturamento dos equipamentos objeto do FORNECIMENTO."
              }),
              new TextRun({
                text: "Carta de Crédito: o COMPRADOR obterá Carta de Crédito com um banco de primeira linha, que tenha adotado os Usos e Costumes Uniformes referentes a Créditos Documentários expedidos pela Câmara de Comércio Internacional, antes do embarque dos equipamentos objetos do FORNECIMENTO e em favor da Philips."
              }),
              new TextRun({
                text: "A Carta de Crédito deverá ser válida por, no mínimo, 6 (seis) meses, a contar da data de emissão e deverá possibilitar embarques parciais, permitindo, no mínimo 21 (vinte e um) dias para apresentação. O COMPRADOR pagará todos os encargos bancários no Brasil. Se o COMPRADOR solicitar que o embarque seja feito de outra forma que não mediante as condições de entrega acordadas na proposta e/ou nessas Condições de Venda, a Carta de Crédito deverá ser emitida em valor suficiente para pagar quaisquer custos de embarque adicionais, se houver."
              }),
              new TextRun({
                text: "Leasing: desde que não tenha efetuado nenhum pagamento, se o COMPRADOR quiser converter o FORNECIMENTO em Leasing, o COMPRADOR providenciará o Contrato de Leasing e todas as outras documentações necessárias e correspondentes, a serem analisadas e aprovadas pela Philips, no prazo a ser estipulado por esta última. O COMPRADOR é responsável pela conversão da operação em Leasing, e deverá garantir a aprovação de todos os termos e condições da sociedade arrendadora nestas Condições de Venda e/ou Proposta, sem alteração. Nenhum equipamento será entregue ao COMPRADOR até que a Philips tenha recebido cópias dos documentos de Leasing totalmente assinados e que os tenha aprovado."
              }),
              new TextRun({
                text: "Reserva de Domínio: nos casos de pagamento parcelado, o COMPRADOR e a Philips, neste ato, expressamente instituem e aceitam um “Pacto de Reserva de Domínio”, pelo qual a Philips retém a titularidade e a propriedade dos equipamentos objeto do FORNECIMENTO, que ficarão sob a posse condicional do COMPRADOR até o pagamento do valor integral referido na proposta, de sorte a assegurar o pagamento tempestivo do preço de compra e de quaisquer outros valores ou obrigações sob estas Condições de Venda. Os equipamentos deverão, obrigatoriamente, serem instalados e montados no endereço descrito na proposta, não podendo, em hipótese alguma, ser remanejado e/ou transferido para outro local, sem a prévia comunicação por escrito à Philips."
              }),
              new TextRun({
                text: "Na hipótese do valor ser em Reais (R$), deverá ser reajustado anualmente pelo índice IGPM quando a COMPRADORA não tiver realizado ainda a instalação do(s) equipamento(s) no prazo previsto neste instrumento."
              }),
              new TextRun({
                text: "A COMPRADORA entende e concorda que, em caso de entrega parcial do equipamento e acessórios, a COMPRADORA deverá efetuar tempestivamente o pagamento das faturas referentes aos itens já entregues. Dessa forma, a COMPRADORA está ciente e de acordo que no caso de faturamento de acessórios em separado do equipamento, tais faturas deverão ser pagas conforme a sua emissão e independentemente da entrega do equipamento e/ou outros acessórios."
              }),
              new TextRun({
                text: "O valor de câmbio será considerado o da data do faturamento na hipótese de devolução de qualquer quantia paga a título de sinal"
              })
            ]
          }),
          new Paragraph({
            text: "CONDIÇÕES DE ENTREGA ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            },
            children: [
              new TextRun({
                text: "Entende-se por prazo de entrega a data da entrega física do equipamento objeto do FORNECIMENTO no local designado pelo COMPRADOR prevista na proposta, desde que cumpridos os pré-requisitos de instalação abaixo expressos. O prazo de entrega está ainda vinculado ao cumprimento dos seguintes pré-requisitos pelo COMPRADOR:                    a. Garantia de que o local de instalação estará pronto quando da chegada do equipamento, devendo este estar completamente pronto, limpo, sem existência de pó ou partículas, com o ar condicionado funcionando e estabilizado em no mínimo 07 (sete) dias antes da entrega do equipamento, respeitando na íntegra o definido no Layout e no Manual de Instalação;                    b. O local de instalação deverá estar com energia elétrica e todos os dispositivos necessários para a proteção do sistema e de suas diversas partes, assim como da hidráulica e gases medicinais, conforme normas aplicáveis; e                    c. Importação e disponibilização das fontes radioativas necessárias ao funcionamento do equipamento antes da finalização dos trabalhos de instalação do equipamento (Equipamentos de Medicina Nuclear).                    "

              }),
              new TextRun({
                text: "O prazo de entrega é improrrogáveis, salvo: (i) se ocorrerem motivos de Caso Fortuito ou Força Maior, conforme definidos no parágrafo único do artigo 393 do Código Civil Brasileiro, que comprovadamente afete o FORNECIMENTO;  (ii) se a Philips solicitar a modificação de dados técnicos relativos ao FORNECIMENTO que impeçam o cumprimento dos prazos de entrega; (iii) por descumprimento de quaisquer obrigações por parte do COMPRADOR ou de terceiros; (iv)ou por acordo escrito firmado entre as partes. Nestes casos, o prazo será prorrogado pelo período estabelecido pela Philips."
              }),
              new TextRun({
                text: "Antes da entrega de qualquer Equipamento, a Philips poderá alterar a construção ou desenho do Equipamento sem notificação ao COMPRADOR, na medida em que a função, a atuação e o desempenho do Equipamento não sejam substancialmente alterados."
              }),
              new TextRun({
                text: "São consideradas modalidades de entrega:"
              }),
              new TextRun({
                text: "Entregas Parciais: a Philips poderá solicitar ao COMPRADOR autorização para realizar entregas parciais, na eventualidade da indisponibilidade de algum item/acessórios, sem que contra a Philips sejam aplicadas quaisquer penalidades ou multas, na medida em que a função, a atuação e o desempenho do Equipamento não sejam substancialmente alterados."
              }),
              new TextRun({
                text: "Embarques/ Entregas Consolidadas: a Philips poderá realizar entregas /embarques parciais de Equipamentos, conforme acima mencionado, salvo se houver manifestação contrária, prévia e formal do COMPRADOR sobre a necessidade de consolidação de carga, ou seja, da entrega simultânea de todos os Equipamentos adquiridos."
              }),
              new TextRun({
                text: "Após a assinatura da proposta, para os equipamentos que demandam prévia adequação do site, será preparado e encaminhado um cronograma de barras, detalhando todas as atividades do projeto e responsabilidades do COMPRADOR.                     4.6 Na venda local, a transferência de propriedade e riscos ocorre após a entrega física dos equipamentos, ficando o COMPRADOR responsável pela guarda e uso do equipamento.             "
              }),
              new TextRun({
                text: "O equipamento objeto do FORNECIMENTO será adequadamente embalado de acordo com os padrões internacionais, de forma a impedir seu dano ou deterioração, durante o período de transporte, até a sua chegada no local de destino. O descarte das embalagens e de todos os resíduos (caixas, plásticos, isopor, etc.) será de responsabilidade do COMPRADOR, não cabendo a Philips nenhuma ação nesta operação."
              }),
              new TextRun({
                text: "Na hipótese em que o equipamento não puder ser transportado até o seu destino, na data em que estiver pronto para ser faturado, pelos motivos expressos no parágrafo anterior, a Philips e o COMPRADOR irão rever conjuntamente o armazenamento do equipamento. Se, contudo, o COMPRADOR solicitar uma postergação na data em que componentes principais do equipamento estejam disponíveis para entrega no almoxarifado da Philips, então o COMPRADOR pagará e/ou reembolsará a Philips por todas as taxas de armazenagem e despesas com consumíveis (ex. gás hélio), quando do recebimento da fatura."
              }),
              new TextRun({
                text: "A Philips envidará esforços razoáveis para cumprir quaisquer datas de entrega orçadas ou reconhecidas. No caso de a Philips não poder despachar os equipamentos para seu destino na data programada devido a motivos fora do controle razoável da Philips, tais como, entre outros, motivos atribuídos ao COMPRADOR, a Philips terá o direito de armazenar os equipamentos em questão por conta e risco do COMPRADOR. O COMPRADOR obriga-se a reembolsar, no prazo de 14 (catorze) dias da primeira exigência da Philips, todas e quaisquer despesas adicionais assim incorridas, assim como despesas com o armazém e aquelas relacionadas com a manutenção do equipamento em boa ordem (ex: consumíveis)."
              }),
              new TextRun({
                text: "A data estimada de despacho e/ou conclusão dos trabalhos de instalação, se oferecidos, deve ser calculada a contar da data em que o banco informar que a carta de crédito e/ou outro instrumento de pagamento acordado foi obtido em conformidade com as Condições de Venda, e/ou o pagamento antecipado, se aplicável, foi recebido."
              }),
              new TextRun({
                text: "A Philips envidará os esforços razoáveis para entregar o equipamento ao COMPRADOR no prazo acordado na proposta, considerando o pleno cumprimento das condições precedentes declarados. Após o cumprimento destes pré-requisitos, a fabricação será iniciada, não sendo mais possível a interrupção da fabricação do equipamento, conforme estabelecido na proposta. Se o COMPRADOR cancelar um pedido antes da efetiva entrega e tiver o direito legal de proceder dessa forma, o COMPRADOR pagará os custos incorridos pela Philips até a data de cancelamento, inclusive, dentre outros, os custos de fabricação do equipamento, os custos de prestação de quaisquer serviços de treinamento, educacionais ou outros ao COMPRADOR com relação a proposta, uma taxa nominal de reposição de estoque e os custos de devolução ou cancelamento de qualquer equipamento encomendado por um terceiro. Quando permitido por Lei, o preço acordado permanecerá devido e exigível."
              })
            ],
          }),
          new Paragraph({
            text: "ENCARGOS TÉCNICOS E OBSOLESCÊNCIA DE EQUIPAMENTOS ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "A Philips terá o direito de fazer alterações no projeto ou nas especificações dos equipamentos a qualquer momento, desde que essa alteração não prejudique o desempenho dos referidos equipamentos.",
              }),
              new TextRun({
                text: "Durante o período de validade do orçamento da Philips, alguns dos equipamentos poderão se tornar obsoletos. Nesse caso, a Philips envidará esforços para fornecer Equipamentos substitutos equivalentes a preços semelhantes, mas não será responsabilizada na hipótese de não haver um equipamento substituto disponível.",
              }),
            ]
          }),
          new Paragraph({
            text: "INSTALAÇÃO E CONDIÇÕES TÉCNICAS ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "O COMPRADOR compromete-se a preparar o local de instalação e disponibilizá-lo à Philips antecipadamente à data de entrega prevista na proposta, seguindo os todos os requisitos técnicos requeridos pelo equipamento objeto do FORNECIMENTO, previstos nos manuais e desenhos de instalação elaborados pela Philips. Essas condições serão avaliadas pela Philips e registradas em documento específico antes da instalação do equipamento.",
              }),
              new TextRun({
                text: "O COMPRADOR obriga-se a não transferir o equipamento do local onde o mesmo for instalado durante a vigência da garantia do FORNECIMENTO, sem a autorização prévia e escrita da Philips, sob pena de cancelamento da garantia.",
              }),
              new TextRun({
                text: "Fica a Philips desobrigada de fazer a instalação do equipamento ofertado caso o prazo de garantia do equipamento tenha terminado nos termos do Anexo II.",
              }),
              new TextRun({
                text: "No caso de alteração nos prazos estabelecidos na proposta“, por um período superior a 90 (noventa) dias, independente do ressarcimento das despesas expressas no parágrafo anterior, as condições contratuais poderão ser revistas pela Philips.",
              }),
              new TextRun({
                text: "No caso de o orçamento ou venda da Philips incluir a instalação dos equipamentos, o COMPRADOR será responsável, por sua conta e risco, pelo seguinte:",
              }),
              new TextRun({
                text: "No caso de o orçamento ou venda da Philips incluir a instalação dos equipamentos, o COMPRADOR será responsável, por sua conta e risco, pelo seguinte:              (a) 	O fornecimento de armazenamento adequado e lacrável no ou próximo ao local de instalação dos equipamentos, a fim de garantir proteção contra furto e quaisquer danos ou deterioração. Qualquer item extraviado ou danificado durante o período de armazenamento será reparado ou substituído a expensas do COMPRADOR.                (b) 	A disponibilidade no ou próximo ao local de instalação de espaços adequados e lacráveis, equipados com instalações sanitárias para o pessoal ou o representante da Philips e para armazenamento das ferramentas e instrumentos do pessoal. O início da instalação em local diferente destas condições coloca em risco a integridade do equipamento e invalida a garantia contratual.                (c) 	A execução e conclusão tempestivas dos trabalhos preparatórios, em conformidade com as exigências que a Philips indicar ao COMPRADOR no devido momento. A preparação do local será de acordo com os códigos de segurança, elétricos e de construção pertinentes aos equipamentos e à sua instalação e de acordo com o Manual de Instalação do Equipamento a ser disponibilizado pela Philips, com base nas informações fornecidas pelo COMPRADOR. A Philips garantirá que a instalação do Equipamento, conforme mostrado no Manual de Instalação, atenderá os requisitos técnicos de funcionamento do Equipamento, cabendo ao COMPRADOR o atendimento às normas locais aplicáveis (ANVISA, ABNT, etc.). A suficiência desses planos e especificações, inclusive, entre outros, especificamente a exatidão das dimensões descritas nesses planos e especificações, será de responsabilidade exclusiva do COMPRADOR. O local de instalação será colocado à disposição da Philips ou de seu representante, sem obstáculos, no devido momento para possibilitar que a Philips ou seu representante inicie o trabalho de instalação na data programada; o pessoal de instalação não será chamado ao local de instalação até que todo o trabalho preparatório tenha sido satisfatoriamente concluído na opinião exclusiva da Philips.                (d) 	A obtenção tempestiva dos alvarás e licenças exigidos pelas autoridades competentes por ou com relação à instalação e à operação dos equipamentos.                (e) 	A obtenção tempestiva de todos os vistos de entrada, saída, residência, trabalho ou quaisquer outras autorizações necessárias para o pessoal da Philips ou dos representantes da Philips e para a importação e exportação de ferramentas, equipamentos e materiais necessários para os trabalhos de instalação e os testes subsequentes.                (f) 	A assistência à Philips ou ao seu representante com relação à remoção do equipamento da entrada das dependências do COMPRADOR até o local da instalação. O COMPRADOR será responsável, a suas expensas, pela regulação, remoção de divisórias ou outros obstáculos e pelo trabalho de restauração. A Philips assume que não existem quaisquer materiais perigosos no local de instalação. Se existirem quaisquer desses materiais, o COMPRADOR será responsável pela devida remoção e descarte dos materiais e embalagens do equipamento, a expensas do COMPRADOR.",
              }),
              new TextRun({
                text: "No caso de todas ou quaisquer condições acima não serem cumpridas devida ou tempestivamente, se a Philips ou seu representante tiver de interromper a instalação e o teste subsequente por motivos não atribuídos à Philips, o período de conclusão será prorrogado de forma correspondente e todos e quaisquer custos adicionais dele resultantes ficarão a cargo do COMPRADOR. A instalação deverá ocorrer de forma imediata a entrega do equipamento no local de instalação. Na hipótese de impedimento da instalação em virtude de ações ou omissões do COMPRADOR, a instalação poderá ser reprogramada, mas até o limite de 12 (doze) meses contados da data inicialmente programada para instalação. Após este prazo, o Equipamento poderá ser instalado, porém os custos dos serviços de instalação deverão ser negociados através do departamento de Serviços da Philips.",
              }),
              new TextRun({
                text: "Na hipótese do Equipamento ser entregue sem que a instalação seja concluída, por culpa do COMPRADOR, esta se responsabiliza pela total integridade do Equipamento, respeitando as condições de armazenamento recomendadas pela Philips, dentre as quais a manutenção do local isento de poeira e umidade, temperatura controlada, ausência de roedores e insetos de qualquer natureza.",
              }),
              new TextRun({
                text: "A não observância destas condições invalida a garantia do Equipamento e suas partes/componentes, e eventuais reparos serão objeto de   negociação entre o COMPRADOR e  a Philips.",
              }),
              new TextRun({
                text: "A Philips não assume qualquer responsabilidade, nem oferece qualquer garantia, quanto à adequação das dependências ou dos serviços públicos disponíveis nas dependências nas quais o equipamento deve ser instalado, usado ou armazenado (salvo os previamente descritos em sua proposta comercial)",
              }),
              new TextRun({
                text: "Ao final da instalação, a Philips ministrará um treinamento básico chamado de “Keyboard Training” e, na sequência, emitirá o documento “Ata de Instalação”, atestando que todos os testes padrão do equipamento foram realizados e que está pronto para uso do primeiro paciente.",
              }),
              new TextRun({
                text: "O COMPRADOR deverá assinar a “Ata de Instalação”, atestando a instalação do equipamento e habilitando-se a receber o treinamento avançado (também conhecido como aplicação), o qual deverá ser agendado pelo COMPRADOR dentro do prazo máximo de 30 (trinta) dias do final da instalação. Havendo a necessidade de qualquer reagendamento, este pode ser realizado sem custo para o COMPRADOR no prazo máximo de 72 (setenta e duas) horas anterior ao agendamento original, após o qual a aplicação coberta por este instrumento será considerada como realizada e uma nova aplicação deverá ser contratada com a Philips.",
              }),
              new TextRun({
                text: "Eventuais despesas com o equipamento produzido, como armazenamento, consumíveis, sistema de refrigeração, serão arcados pelo COMPRADOR.",
              }),
              new TextRun({
                text: "As cláusulas acima devem ser observadas levando em consideração os equipamentos que necessitam de instalação.",
              }),
              new TextRun({
                text: "A COMPRADORA se compromete a assinar um “Certificado de Posse” do(s) Equipamento(s) caso a instalação não possa ser executada no prazo máximo de 90 (noventa) dias após a respectiva entrega, decerto que nele se estabelecerá a data final para a instalação, que deverá ocorrer em até 01 (um) ano após a entrega.",
              }),
            ]
          }),
          new Paragraph({
            text: "TERMO DE ACEITE DO EQUIPAMENTO ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "Quando aplicável, a instalação do equipamento objeto do FORNECIMENTO oferecido na proposta, a Philips notificará o COMPRADOR quando os Equipamentos instalados estiverem prontos para teste e aceitação, convidando o COMPRADOR a participar dos testes padrões ou dos testes que possam ter sido acordado por escrito entre as partes, a fim de demonstrar a conformidade com as especificações acordadas e/ou inspecionar o trabalho de instalação.",
              }),
              new TextRun({
                text: "Se o COMPRADOR não comparecer ao teste na data notificada, a equipe técnica da Philips ou de seu representante iniciará os testes de acordo com os procedimentos de teste padrão da Philips e esses testes serão considerados realizados na presença do inspetor do cliente e a aceitação ocorrerá, nesse caso, com base nos resultados declarados no certificado de teste assinado pelos engenheiros designados e habilitados pela vendedora (”Relatório de Status do Sistema).",
              }),
              new TextRun({
                text: "No caso de rejeição dos Equipamentos instalados por motivos justificados pelo COMPRADOR, a ser enviados à Philips detalhadamente e por escrito no prazo de 10 (dez) dias após a conclusão dos testes de aceitação em questão, a Philips deverá, como único recurso, corrigir a deficiência o quanto antes possível e as partes pertinentes do teste de aceitação serão repetidas dentro de um período razoável, em conformidade com os procedimentos descritos acima.",
              }),
              new TextRun({
                text: "A instalação deverá ocorrer de forma imediata à entrega do Equipamento no local de instalação. Após a conclusão da instalação do Equipamento, a Philips demonstrará o perfeito funcionamento do Equipamento deixando-o pronto para uso.  Neste ato, o COMPRADOR se compromete a assinar o “Termo de Instalação”. A falta de assinatura do COMPRADOR automaticamente classifica o Equipamento como “não instalado”. Nessa situação ele não pode ser operado em nenhuma hipótese pelo COMPRADOR e o descumprimento desta disposição caracterizará uso não autorizado e indevido. Se dentro de 10 (dez) dias após a conclusão do teste de aceitação a Philips não tiver recebido o “Termo de Aceite”, o Equipamento permanecerá desligado até a assinatura do respectivo documento.",
              }),
              new TextRun({
                text: "Após a conclusão da instalação do equipamento, a Philips demonstrará o perfeito funcionamento do equipamento deixando-o pronto para uso.  Neste ato, o COMPRADOR se compromete a assinar a Ata de Instalação, devendo a instalação ocorrer de forma imediata a entrega do equipamento no local de instalação. Na hipótese de impedimento da instalação em virtude de ações ou omissões do COMPRADOR, a instalação poderá ser reprogramada, mas até o limite de 12 (doze) meses contados da data inicialmente programada para instalação. Após este prazo, o equipamento poderá ser instalado, porém os custos dos serviços de instalação deverão ser negociados através do departamento de Serviços da Philips. Se dentro de 10 (dez) dias após a conclusão do teste de aceitação, a Philips não tiver recebido a Ata de Instalação, o produto permanecerá desligado até a assinatura da Ata de Instalação. ",
              }),
              new TextRun({
                text: "Defeitos ou desvios secundários que não afetem o uso operacional dos Equipamentos instalados, serão declarados no certificado de aceitação, porém não obstruirão nem suspenderão a aceitação por parte do COMPRADOR.",
              }),
              new TextRun({
                text: "Caso o COMPRADOR se recuse assinar a Ata de Instalação e tendo transcorrido o período de garantia, poderá a Philips notificar por escrito o COMPRADOR para emissão de referido documento. Tal notificação será suficiente para atestar a aceitação final dos equipamentos, de maneira tácita, valendo tal recebimento para todos os fins e efeitos destas Condições de Venda.",
              }),
              new TextRun({
                text: "Eventuais despesas com o EQUIPAMENTO produzido, como armazenamento, consumíveis, sistema de refrigeração, serão arcados pelo COMPRADOR.",
              }),
              new TextRun({
                text: "As cláusulas acima devem ser observados levando em consideração os equipamentos que necessitam de Termo de Aceite, vez que para a Linha de PCMS aplica-se instalação somente para as Centrais de Monitorização.",
              }),
              new TextRun({
                text: "São de responsabilidades do COMPRADOR, infraestrutura (compra e instalação de cabos, bem como instalação de pontos de rede, roteadores e tomadas).",
              }),
              new TextRun({
                text: "A instalação limita-se a configuração da Central, Switch e demais itens entregues juntos com a mesma. Na ausência da infraestrutura adequada, não será possível a instalação do referido equipamento.",
              }),
            ]
          }),
          new Paragraph({
            text: "APLICAÇÃO E TREINAMENTOS ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "Os treinamentos serão ministrados no local de instalação do equipamento, devendo ser realizados sempre em dias úteis e consecutivos, no período das 8:00h às 17:00h. O treinamento será ministrado após o término da montagem /instalação, limitado, porém, a 6 (seis) meses contados do término da montagem/instalação.               ",
              }),
              new TextRun({
                text: "A Philips realizará os treinamentos dos equipamentos da seguinte forma:                (i)	Em 02 (duas) semanas com 32 (trinta e duas) horas cada, para Equipamentos de Ressonância Magnética;                (ii)	Em 02 (duas) semana com 32 (trinta e duas) horas cada, para Equipamentos de Tomografia Computadorizada com pacote cardíaco; e em 01 (uma) semana com 32 (trinta e duas) horas para os modelos sem pacote cardíaco;                (iii)	Em 02 (duas) semana com 32 (trinta e duas) horas cada, para Equipamentos de Medicina Nuclear; e em 03 (três) semanas com 32 (trinta e duas) horas cada para os modelos PET CT;                (iv)	Para os Equipamentos de Arco Cirúrgico, o treinamento será realizado:                (a)	BV Vectra considerar 16 (dezesseis) horas totais ministrados em 2 (dois) dias;                (b)	BV Endura considerar 16 (dezesseis) horas totais ministrados em 2 (dois) dias;                 (c)	Zenition 50 considerar 16 (dezesseis) horas totais ministrados em 2 (dois) dias;                 (d)	Zenition 70 considerar 24 (vinte e quatro) horas totais ministrados em 3 (três) dias.                (v)	Para os equipamentos de Hemodinâmica.Azurion 7 12, Azurion 7 20, Azurion 3 12 e Azurion 3 15, Azurion 5 12 e Azurion 5 20, Azurion Biplano e Azurion Flexarm com até 3 ferramentas avançadas, considerar 64 horas, divididas em 2 semanas de 32 horas cada, sendo elas separadas por um período mínimo de 2 meses e não superior a 1 ano. Para equipamentos (Azurion 7 12, Azurion 7 20, Azurion Biplano e Azurion Flexarm) com mais de 3 ferramentas avançadas considerar 96(noventa e seis horas) horas, sendo elas divididas em 3(três) semanas de 32 (trinta e duas) horas cada, separadas por um período mínimo de 2 meses e não superior a 1 ano.                 (vi)	Para Upgrades Smarth Path, o treinamento será realizado:                (a)	Upgrade para Clarity e Upgrade Catalyst sem ferramentas avançadas:  em 1 (uma) semana de 32 (trinta e duas) horas;                 (b)	 Para Upgrade Catalyst com até 3 ferramentas avançadas: em 64 (sessenta e quatro) horas, sendo elas divididas em 2 (duas) semanas de 32 (trinta e duas) horas, separadas por um período mínimo de 2 (meses) e não superior a 1 (um) ano;                (c)	 Para upgrade Catalyst com mais de 3 (três) ferramentas avançadas: em 3 (três) semanas de 32 (trinta e duas) horas, separadas por um período mínimo de 2 (dois) meses e não superior a 1 (um) ano.7. Para vendas avulsas de ferramentas avançadas, considerar 8(oito) horas para cada ferramenta.                 (vii) Para vendas avulsas de ferramentas avançadas, o treinamento será realizado em 8 (oito) horas para cada ferramenta.                (viii) Para Equipamentos de Ultrassonografia, o treinamento será realizado em 01 (um) dia com 08 (oito) horas, podendo o mesmo, vir a sofrer alteração de acordo com modelo e configuração do equipamento. (ix). Para os equipamentos como: Monitores Multiparamétricos, desfibriladores, ventiladores e eletrocardigrafos, considerar 2 (dois) dias com 3 (três) turnos.                (x). Para os Equipamentos de Patologia Digital, o treinamento será realizado em 4 (quatro) dias com 32 (trinta e duas) horas totais.                (xi). CONVERSÃO DE 1.5T - A aplicação deverá ser realizada 02 (duas) semanas com 32 (trinta e duas) horas cada após a instalação da máquina,totalizando 64 (sessenta e quatro) onde o usuário deverá começar a utilizar a mesma com os conhecimentos adquiridos na instalação.                (xii); CONVERSÃO DE 3T - A aplicação deverá ser realizada 03 (três) semanas com 32 (trinta e duas) horas cada após a instalação da máquina, totalizando 96 (noventa e seis) horas de aplicação onde o usuário deverá começar a utilizar a mesma com os conhecimentos adquiridos na instalação.                (xiii). Para Upgrades de Ressonância: 1 (Uma) semana com 32 (trinta e duas) horas e será realizado até 30 dias após a instalação.                ",
              }),
              new TextRun({
                text: "Para a comercialização e instalação de equipamentos novos que utilizem Hélio, a Philips os entregará totalmente funcionais, com o nível de Hélio dentro dos limites operacionais d(s) Equipamento(s): 70% para equipamentos Prodiva e 65% para os demais modelos). Essa condição não se aplica a upgrades e conversões de equipamentos da base instalada.",
              })
            ]
          }),
          new Paragraph({
            text: "CONDIÇÕES DE GARANTIA ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "As garantias dos equipamentos objeto do FORNECIMENTO são exclusivamente aquelas dispostas no Termo de Garantía anexo a estas Condições de Venda.",
              }),
              new TextRun({
                text: "Alguns equipamentos recém-fabricados poderão conter peças selecionadas remanufaturadas, mas equivalentes a novas em termos de desempenho. As peças de reposição serão novas ou equivalentes a uma nova em termos de desempenho.",
              }),
              new TextRun({
                text: "As garantias estabelecidas nestas Condições de Venda ou em outro documento de garantia da Philips, com relação a um equipamento, são as garantias exclusivas prestadas pela Philips com relação ao FORNECIMENTO, ao Software e às operações previstas em decorrência destas Condições de Venda e substituem expressamente quaisquer outras garantias, expressas ou tácitas, inclusive, entre outras, qualquer garantia de comercialidade ou adequação para uma finalidade específica.",
              }),
            ]
          }),
          new Paragraph({
            text: "SOFTWARE E LICENÇAS ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "Todo software é e continuará sendo de propriedade exclusiva da Philips ou de seus fornecedores de software. As condições gerais de licenciamento de software do COMPRADOR, anexas a estas Condições Gerais, contêm acordos de garantia específica com relação a qualquer Software Licenciado (conforme definido nas “Condições Gerais de Licenciamento de Software ao COMPRADOR”).",
              })
            ]
          }),
          new Paragraph({
            text: " LIMITAÇÃO DE RESPONSABILIDADE ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "A responsabilidade global da Philips, de seus representantes, funcionários, agentes, subcontratadas e fornecedores, para fins de indenização ou por qualquer violação relacionada ao FORNECIMENTO, perdas e danos, lucros cessantes, inclusive, danos causados à propriedade, multas, penalidades, rescisão, indenizações, ressarcimentos ou quaisquer outras compensações,  violação contratual, garantia, negligência, indenização  ou qualquer outra responsabilidade civil, fica limitada a 100% (cem por cento) do valor total do FORNECIMENTO, software licenciado ou serviços previstos na proposta, que deu origem à tal responsabilidade.",
              }),
              new TextRun({
                text: "A Philips e seus representantes, em nenhuma hipótese, serão responsáveis por indenizar lucros cessantes e/ou quaisquer perdas e danos indiretos, incidentais, imprevistos ou cobertura, perda de receita, de produção, danos à imagem ou perda de uso com relação ou em função  destas Condições de Venda  ou de qualquer contrato que o COMPRADOR tenha firmado com quaisquer terceiros ou, ainda, da impossibilidade de usar equipamentos, inclusive software (incorporado), dados médicos ou outros dados armazenados nas mercadorias, mídia magnética e/ou recarregamento de dados.",
              }),
              new TextRun({
                text: "Se um terceiro fizer ou tentar fazer uma reivindicação contra o COMPRADOR, alegando que um Equipamento da Philips entregue nos termos deste instrumento viola uma reivindicação válida segundo uma patente, modelo de utilidade, desenho industrial, direito autoral, segredo de negócios, topografia de circuito integrado ou marca (conjuntamente “Direito de Propriedade Intelectual”), o COMPRADOR deverá (a) enviar à Philips notificação imediata por escrito a respeito da reivindicação, e (b) transmitir à Philips informações completas e integrais; e se a Philips optar, por escrito, por defender, fazer acordo ou negociar a reivindicação, o COMPRADOR deverá (i) conceder à Philips o exclusivo controle de qualquer defesa ou acordo que ela possa assumir e (ii) oferecer à Philips toda a assistência razoável, se assim desejado pela Philips.",
              }),
              new TextRun({
                text: "A Philips não terá qualquer obrigação referente a qualquer reivindicação de violação e o COMPRADOR deverá reembolsar todos os custos razoáveis (inclusive, entre outros, honorários advocatícios), caso a reivindicação seja proveniente: (a) do cumprimento pela Philips dos desenhos, especificações ou instruções do COMPRADOR ; (b) do uso pela Philips de informações técnicas ou tecnologia fornecidas pelo COMPRADOR ; (c) de modificações ao Equipamento feitas pelo COMPRADOR ou seus agentes; (d) do uso do Equipamento que não seja de acordo com as especificações de Equipamento ou instruções escritas de Equipamento aplicáveis; (e) do uso do Equipamento com Equipamentos não fabricados pela Philips, se a infração teria sido evitada pelo uso de uma release atual inalterada do Equipamentos da Philips, do Equipamento de terceiros ou de ambos. Além disso, a Philips não será responsável por qualquer reivindicação quando os danos pleiteados forem com base, direta ou indiretamente, na quantidade ou no valor dos Equipamentos ou serviços gerados por meio dos Equipamentos comprados segundo o orçamento, ou com base no valor de uso do Equipamento, independentemente de essa reivindicação alegar que o Equipamento ou seu uso viola ou contribui com a violação dessa reivindicação.",
              }),
              new TextRun({
                text: "Na hipótese de (a) uma sentença não passível de recurso de um tribunal competente declarar que a reivindicação é válida ou (b) a Philips considerar que o Equipamento viola o referido pedido, a Philips poderá, a seu critério, (i) obter o direito de o COMPRADOR continuar usando o Equipamento, (ii) substituir ou modificar o Equipamento para evitar a violação, ou (iii) reembolsar ao COMPRADOR uma parcela razoável do preço de compra do Equipamento mediante a devolução do Equipamento original.",
              }),
              new TextRun({
                text: "Os termos contidos nesta cláusula declaram a obrigação e responsabilidade integrais da Philips com relação às reivindicações de violação, e o recurso exclusivo do COMPRADOR na hipótese de uma reivindicação de violação",
              }),
            ]
          }),
          new Paragraph({
            text: "USO E PROPRIEDADE DE DOCUMENTOS ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: " Todas as informações técnicas relativas aos equipamentos e à sua manutenção são informações exclusivas da Philips, protegidas pelos direitos autorais da Philips, continuarão sendo de propriedade da Philips e não poderão ser copiadas, reproduzidas, transmitidas ou comunicadas, tampouco utilizadas por terceiros sem o prévio consentimento por escrito da Philips. Dados como, entre outros, ilustrações, catálogos, cores, desenhos, dimensões, declarações de peso e medidas, colocados à disposição como informações (impressas) representam dados aproximados apenas e o COMPRADOR não poderá obter quaisquer direitos com base nesses dados.",
              }),
            ]
          }),
          new Paragraph({
            text: "CONTROLE DE EXPORTAÇÃO ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "O COMPRADOR compreende que algumas operações comerciais da Philips se encontram sujeitas às leis e regulamentações relacionadas ao controle de exportação nacional, das Nações Unidas, da União Europeia, dos Estados Unidos e de outros, não se limitando apenas a estes, que proíbe a exportação ou desvio de determinadas mercadorias e tecnologias para países sob embargo ou sanção comercial. ",
              }),
              new TextRun({
                text: "13.2 Toda e qualquer a obrigação da Philips relacionada à exportação, reexportação ou transferência de mercadorias, bem como qualquer assistência técnica, treinamento, investimento, assistência financeira, financiamento e intermediação, estará sujeita à regulamentação de controle de exportação que dispõe sobre os controles, licenças de exportação e sobre a entrega de mercadorias, serviços e tecnologia ao exterior.",
              }),
              new TextRun({
                text: "13.4 Se a venda e entrega das mercadorias, serviços e/ou tecnologia encontrarem se condicionadas à concessão de licenças de exportação pelas autoridade governamental competente, a Philips não poderá cumprir o presente contrato até que obtenha tais licenças.",
              }),
              new TextRun({
                text: "13.5 Na hipótese de restrição ou proibição da venda e entrega das mercadorias, serviços e/ou tecnologia em razão do controle de exportação, a Philips não estará obrigada a cumprir o presente contrato, resultando no cancelamento do pedido, sem incorrer em obrigação alguma perante o COMPRADOR.",
              }),
              new TextRun({
                text: "13.6 O COMPRADOR deverá cumprir com todas as leis e regulamentações de controle de exportação para cada mercadoria fornecida pela Philips, aceitando a responsabilidade de impor todas as restrições resultantes na hipótese de transferência ou reexportação para terceiros.",
              }),
              new TextRun({
                text: "13.7 O COMPRADOR deve tomar todas as providências necessárias para assegurar que não ocorram violação das leis e regras de controle de exportação. O COMPRADOR deverá indenizar a Philips por eventuais danos diretos e indiretos, incluindo custos advocatícios, decorrentes de penalidades pela violação ou não conformidade das regras de controle de exportação.",
              }),
              new TextRun({
                text: "13.8 O COMPRADOR reconhece que as obrigações estabelecidas no presente contrato permanecem em vigência mesmo após a conclusão do fornecimento das mercadorias, software, serviço e/ou tecnologia ao COMPRADOR. Adicionalmente, em caso de conflito nos termos estabelecidos entre o presente contrato e outra documentação fornecida pela Philips ao COMPRADOR, o COMPRADOR entende que prevalecem os termos do presente contrato.",
              }),
            ]
          }),
          new Paragraph({
            text: "CONFIDENCIALIDADE ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "14.1 Cada parte manterá em sigilo quaisquer informações fornecidas ou divulgadas a uma parte pela outra parte, sejam divulgadas por escrito, eletrônica ou verbalmente, com relação aos Equipamentos e negócios da parte divulgadora, seus clientes e/ou seus pacientes, e este orçamento ou venda e a seus termos, inclusive quaisquer informações sobre definição de preço. Cada parte usará o mesmo grau de cuidado para proteger a confidencialidade das informações divulgadas por ela usados para proteger a confidencialidade de suas próprias informações semelhantes, porém não menos do que o cuidado razoável. Cada parte divulgará essas informações somente a seus funcionários que tenham a necessidade de conhecê-las para desempenhar as operações previstas no orçamento. A obrigação de manter a confidencialidade dessas informações não se estenderá às informações de domínio público no momento da divulgação e/ou às informações que devam ser divulgadas por lei ou por decisão judicial.",
              })
            ]
          }),
          new Paragraph({
            text: "CASO FORTUÍTO OU FORÇA MAIOR ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "15.1 Cada parte tem o direito de suspender o cumprimento de suas obrigações em decorrência de qualquer atraso ou inadimplemento causado por eventos fora de seu controle razoável, inclusive, entre outros, casos fortuitos, guerra, guerra civil, insurreição, incêndios, inundações, reclamações trabalhistas, epidemias, normas governamentais e/ou atos semelhantes, embargos de transporte, indisponibilidade, por parte da Philips, de quaisquer alvarás, licenças e/ou autorizações exigidas, inadimplementos ou força maior de fornecedores ou subcontratadas.",
              }),
              new TextRun({
                text: "15.2 Se o evento de força maior impedir a Philips de atender qualquer pedido do COMPRADOR ou de outro modo cumprir qualquer obrigação decorrente da venda, a Philips não será responsável por qualquer indenização, reembolso ou danos, sejam por perda direta, indireta ou imprevista, ou outra.",
              })
            ]
          }),
          new Paragraph({
            text: "RESCISÃO ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "16.1. Estas Condições de Venda entrarão em vigor quando de sua assinatura, vigorando até o final do período de garantia ou pelo período disposto na proposta.",
              }),
              new TextRun({
                text: "16.2. As presentes Condições de Venda poderão ser rescindidas, por quaisquer partes, caso ocorra decretação de falência, pedido de recuperação judicial, dissolução judicial ou extrajudicial de uma parte, sem prejuízo do direito de cobrança de eventuais créditos que sejam devidos por uma parte à outra.",
              }),
              new TextRun({
                text: "16.3 Independente da condição de pagamento, caso a COMPRADORA não realize a ordem de produção do(s) equipamento(s) no prazo de 15 (quinze) meses para os equipamentos de MR, DXR, CT, AMI, IGT e ICAP e 12 (doze) meses para os equipamentos de US, SRC e MA&TC contados da data da assinatura do Contrato, a COMPRADORA deverá adiantar à VENDEDORA o valor correspondente a 10% (dez por cento) do valor total do Contrato e enviar cópia do comprovante de depósito, salvo se a COMPRADORA tiver efetuado o pagamento do sinal. Parágrafo primeiro. Caso a COMPRADORA rescinda imotivadamente o Contrato antes da ordem de produção, o valor pago pela COMPRADORA  a título de adiantamento será retido pela VENDEDORA a título de multa rescisória.                    Parágrafo segundo. Se a COMPRADORA decidir manter o Contrato, a COMPRADORA deverá providenciar a adequação do local de instalação do equipamento até o 30° (trigésimo) mês para os equipamentos de MR, DXR, CT, AMI, IGT e ICAP e até o 20º (vigésimo) para os equipamentos de US, SRC e MA&TC contados da data da assinatura do Contrato. A não adequação do local de instalação será considerada inadimplemento contratual e facultará a VENDEDORA entregar o equipamento acondicionado em caixas no local estabelecido no Anexo I, devendo a COMPRADORA assinar o Certificado de Posse do equipamento. Se a COMPRADORA se recusar a receber o equipamento e a fornecer o Certificado de Posse assinado, a VENDEDORA notificará a COMPRADORA para sanar o inadimplemento no prazo de 15 (quinze) dias.  Se o inadimplemento não for sanado no prazo indicado, a Philips poderá rescindir o Contrato, com a retenção da multa rescisória prevista na Cláusula 1.1 supra e a cobrança dos custos de produção do equipamento.                    Parágrafo terceiro. Se a COMPRADORA decidir manter o Contrato, o adiantamento mencionado na Cláusula 1° supra será abatido do montante total, sendo que os 90% restantes deverão seguir a condição de pagamento original.                         Parágrafo quarto. O valor correspondente à multa poderá ser descontado pela VENDEDORA de eventual quantia paga pela COMPRADORA a título de sinal, em sendo o caso.                     Parágrafo quinto. Caso a COMPRADORA tenha efetuado a antecipação de algum pagamento à VENDEDORA, esta devolverá àquela o respectivo valor em até 60 (sessenta) dias, descontado o valor da multa prevista no caput.                    ",
              }),
              new TextRun({
                text: "16.4 Além do disposto acima, as partes deverão realizar um encontro de contas para apuração de eventual diferença entre o total das parcelas já pagas e o valor total dos equipamentos que sejam parte do FORNECIMENTO já entregues ou já despachados pela Philips até a data do recebimento da notificação de rescisão ou equipamentos prontos para entrega que sejam parte do FORNECIMENTO, já encomendados pela Philips ou em processo de importação ou fabricação.",
              }),
            ]
          }),
          new Paragraph({
            text: "DISPOSIÇÕES DIVERSAS ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 1,
            }, children: [
              new TextRun({
                text: "17.1 Se o COMPRADOR se tornar insolvente, for incapaz de pagar suas dívidas no vencimento, apresentar pedido de falência, for objeto de falência involuntária, tiver um administrador judicial nomeado ou tiver seus ativos cedidos ou congelados, a Philips poderá cancelar quaisquer obrigações não cumpridas ou suspender o cumprimento, entretanto, as obrigações financeiras do COMPRADOR perante a Philips permanecerão em vigor. ",
              }),
              new TextRun({
                text: "17.2 Estas Condições de Vendas não poderão ser cedidas ou transferidas a qualquer título, por qualquer das Partes a terceiros, sem a prévia e expressa anuência por escrito da outra Parte, com exceção do previsto no item único abaixo:                    (i) A Philips poderá ceder ou transferir o FORNECIMENTO objeto da proposta sem o prévio e expresso consentimento do COMPRADOR nas seguintes hipóteses: (a) à qualquer entidade controlada, controladoras, afiliadas ou do mesmo grupo econômico da Philips ou (b) na ocorrência de incorporação, reorganização, transferência, venda de ativos ou linha(s) de produtos ou mudanças de controle ou propriedade da Philips.                    ",
              }),
              new TextRun({
                text: "17.3  Todas as disposições do presente documento serão regidas aplicável da República Federativa do Brasil, estando eleito o Foro da Comarca da Capital de São Paulo como o competente para dirimir quaisquer dúvidas e controvérsias advindos do mesmo.",
              }),
              new TextRun({
                text: "17.4  Os termos e condições contidos neste orçamento ou venda, juntamente com estas Condições de Venda, constituem o entendimento e acordo integrais entre as partes com relação às operações previstas neste orçamento ou venda, e substituem quaisquer entendimentos ou acordos anteriores entre as partes, sejam verbais ou escritos, com relação às operações aqui previstas. A fixação de preço neste orçamento ou venda é com base nos termos e condições aqui estabelecidos. Nenhum termo, condição, consentimento, renúncia, alteração ou modificação adicional será vinculativo, a menos que por escrito e assinado pelas partes.",
              }),
              new TextRun({
                text: "17.5 Se qualquer disposição contida nestas Condições de Venda for considerada ilegal, inexequível ou inválida, total ou parcialmente, a validade e exequibilidade das disposições remanescentes não serão afetadas nem prejudicadas e permanecerão em pleno vigor e efeito. Na substituição de qualquer disposição considerada ilegal, inexequível ou inválida, total ou parcialmente, uma disposição que reflita a intenção original deste instrumento na medida admissível segundo as leis aplicáveis será considerada substituir a referida disposição.",
              }),
              new TextRun({
                text: "17.6 Na hipótese de solicitação de rescisão destas Condições de Venda sem justa causa por parte do COMPRADOR, os valores pagos como sinal não serão reembolsados, não cabendo ao COMPRADOR nenhuma reivindicação neste sentido, salvo por força maior e/ou caso fortuito, conforme disposto na Cláusula 15 acima.",

              }),
              new TextRun({
                text: "17.7 As obrigações do Comprador são independentes de quaisquer outras obrigações que o COMPRADOR possa ter segundo qualquer outro acordo, contrato ou conta com a Philips. O Comprador não exercerá qualquer direito de compensação referente aos termos e às condições contidos neste orçamento ou venda ou com relação a qualquer outro acordo, contrato ou conta com a Philips.",
              }),
              new TextRun({
                text: "17.8 As obrigações do Comprador são independentes de quaisquer outras obrigações que o COMPRADOR possa ter segundo qualquer outro acordo, contrato ou conta com a Philips. O Comprador não exercerá qualquer direito de compensação referente aos termos e às condições contidos na proposta ou venda ou com relação a qualquer outro acordo, contrato ou conta com a Philips.",
              }),
              new TextRun({
                text: "17.9 Todos os avisos, comunicações e solicitações que tiverem de ser feitos por uma Parte à outra, devem ser dirigidos por escrito à Parte interessada, através de carta registrada com aviso de recebimento, via e-mail, e considerando os endereços abaixo indicados:                    ",
              }),
              new TextRun({
                text: "Para o COMPRADOR:                                  Nome: xxxx                    Telefone: xxxx                    E-mail: xxxx",
              })
            ]
          }),
          new Paragraph({
            text: "            ANEXO I - DAS CONDIÇÕES GERAIS DE LICENCIAMENTO DE SOFTWARE AO COMPRADOR            ",
            heading: HeadingLevel.HEADING_2,
            bold: true,
          }),
          new Paragraph({
            text: "O presente anexo não se sobrepõe ou substitui quaisquer termos do Contrato e demais anexos ou embasa contratos aplicáveis ao(s) Equipamento(s) objeto daquele documento.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "A Philips concede à COMPRADORA um direito e licença não-exclusiva e não-transferível para uso do pacote de software de computador (o “Software”) necessário para a operação do(s) Equipamento(s), conforme os termos e condições aqui previstos. Esta Licença existirá pelo tempo que a COMPRADORA for a possuidora/proprietária do(s) Equipamento(s), exceto se a Philips cancelar a licença na hipótese de a COMPRADORA se tornar inadimplente. Em caso de término/cancelamento desta Licença, a COMPRADORA deverá imediatamente devolver à Philips o Software.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "Esta Licença não é extensiva a qualquer serviço ou manutenção de software ou documentação fornecida juntamente com o(s) Equipamento(s) e/ou localizada nas dependências da COMPRADORA. O propósito de tal software e da documentação é apenas o de guiar a VENDEDORA e seus agentes autorizados a instalar e a testar o(s) Equipamento(s), ou a guiar a Philips e seus agentes autorizados na manutenção do(s) Equipamento(s) sob um contrato em separado com a COMPRADORA. A COMPRADORA desde já concorda a restringir o acesso a tal software e à documentação apenas aos funcionários da Philips bem como seus agentes autorizados.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "Esta Licença não inclui qualquer direito de uso do software para propósito diverso ao da operação do(s) Equipamento(s). A COMPRADORA não poderá copiar, reproduzir, vender, ceder, transferir, ou sublicenciar o Software para qualquer propósito.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "Os direitos da COMPRADORA sob esta Licença condicionam-se à não execução, por parte dela, de quaisquer ações que requeiram qualquer software fornecido com o(s) Equipamento(s), o(s) Equipamento(s) propriamente dito(s) ou qualquer trabalho derivado, a ser licenciado como Software Disponível Publicamente, incluindo, mas sem limitação, o seguinte:            (i) Incorporar Software Identificado em tal software, no(s) Equipamento(s) ou qualquer trabalho derivado;            (ii) Combinar o Software Identificado com tal software, com o(s) Equipamento(s) ou qualquer trabalho derivado;            (iii) Distribuir o Software Identificado em conjunto com tal software, com o(s) Equipamento(s) ou qualquer trabalho derivado; ou            (iv) Usar o Software Identificado no desenvolvimento de trabalho derivado de tal software ou Equipamento.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "Para efeito do aqui disposto:            (i) Software identificado inclui, sem limitação, software disponível publicamente e significa software licenciado de forma a:            (a) Criar ou pretender criar obrigações para a Philips, suas coligadas ou fornecedoras em relação a qualquer software fornecido com o(s) Equipamento(s), Equipamento(s) ou um trabalho derivado; ou             (b) Conceder ou pretender conceder a terceiros quaisquer direitos ou imunidades relativos a propriedade intelectual ou direitos proprietários da Philips, suas coligadas ou seus fornecedores em tal software, no(s) Equipamento(s) ou um trabalho derivado; e            (ii) Software disponível publicamente significa qualquer software que exija, como condição de uso, a modificação e/ou a distribuição de tal software de forma que outro software a ele incorporado, derivado ou distribuído juntamente a tal software seja:            (a) Revelado ou distribuído em forma de código de origem;            (b) Licenciado para o propósito de fazer trabalhos derivados; ou             (c) Redistribuído sem custo.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "A COMPRADORA deverá manter a Philips e suas coligadas indenes de quaisquer danos ou custos resultantes ou em conexão com qualquer violação ou quebra das condições da presente licença. A COMPRADORA deverá reembolsar todos os custos e despesas incorridas pela Philips e/ou suas coligadas ao se defenderem em quaisquer ações, processos ou procedimentos resultantes ou em conexão com tal violação ou quebra.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "Esta Licença não afetará a propriedade exclusiva da Philips sob o Software ou de quaisquer marcas registradas, direitos autorais, patentes, segredo industrial, ou outros direitos de propriedade da Philips (ou quaisquer de seus fornecedores) relacionados ao Software.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "A COMPRADORA concorda que apenas seus diretores, empregados e agentes autorizados utilizarão o Software ou terão acesso ao Software (ou qualquer parte do Software), e que nenhum deles revelará no todo ou em parte o Software, ou permitirá que o Software, no todo ou em parte, seja usado por qualquer pessoa ou entidade diferente daquela identificada neste Contrato de Licença. A COMPRADORA reconhece que certos direitos da Philips derivam de contratos de licença com terceiros, e a COMPRADORA concorda em preservar a confidencialidade da informação fornecida para a Philips em razão de contratos de licença. Se a COMPRADORA modificar o Software de qualquer forma, todas as garantias associadas ao Software e ao(s) Equipamento(s) se tornarão nulas de pleno direito. Se a COMPRADORA ou qualquer de seus diretores, funcionários ou agentes inventar quaisquer revisões, melhoramentos, adições ou modificações no Software, a COMPRADORA deverá revelá-las à Philips, e a Philips terá o direito de usar essas licença sem exclusividade e sem obrigação de pagar royalties, podendo sublicenciá-las.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "O Software é licenciado à COMPRADORA da seguinte forma:            (i) A COMPRADORA deverá manter a configuração do(s) Equipamento(s) conforme originalmente desenhado e fabricado; e            (ii) O(s) Equipamento(s) inclui(em) apenas aqueles subsistemas e componentes certificados pela Philips. O Software poderá funcionar de maneira diversa da que foi programado em sistemas modificados por terceiros que não a Philips ou seus agentes autorizados, ou em sistemas que incluam sub-sistemas ou componentes não autorizados pela Philips. A Philips não se responsabiliza por modificações ou substituições não autorizadas de subsistemas ou componentes.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "A responsabilidade, se houver alguma, da Philips por danos resultantes do descumprimento dos termos desta Licença, garantia, negligência, indenização, responsabilidade estrita ou outro ato ilícito extracontratual, ou de qualquer forma relacionado ao Software, ao(s) Equipamento(s)e a(os) serviços, é limitada a um valor que não exceda o valor de mercado da licença aplicável ao Software.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "As garantias estabelecidas no documento de garantia da Philips em relação ao(s) Equipamento(s) (incluindo o Software fornecido juntamente com o(s) Equipamento(s)) são as únicas garantias feitas pela Philips em relação ao(s) Equipamento(s) e ao Software objeto do Contrato ao qual esta licença é parte integrante e se sobrepõem a outras garantias, expressas ou não, incluindo, mas não se limitando, a qualquer garantia mercadológica ou adequação para um propósito específico.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "A Philips, em hipótese alguma, será responsabilizada por qualquer dano específico, indireto, incidental, consequencial ou especial, incluindo, mas não se limitando, pela perda de lucros ou de receita, ou o custo de equipamentos substitutos (incluindo o software) ou serviços resultantes da quebra dos termos contidos neste Contrato de Licença, quebra de garantia, negligência, imprudência, imperícia ou qualquer outra responsabilidade civil. A Philips não se responsabilizará por qualquer dado fornecido gratuitamente ao COMPRADOR.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "O Software deverá ser usado exclusivamente no(s) Equipamento(s), assim definido no Contrato.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 5,
            }
          }),
          new Paragraph({
            text: "            ANEXO II - TERMO DE GARANTIA            ",
            heading: HeadingLevel.HEADING_2,
            bold: true,
          }),
          new Paragraph({
            text: "Os equipamentos fabricados pela Philips Medical Systems – Nederland B.V. (“PHILIPS”) ou Philips Medical Systems Ltda., são garantidos contra defeitos e/ou falhas que, sob condições adequadas de uso, manutenção e operação, ocorram devido a eventual defeito de fabricação ou de material utilizado para a sua confecção pelo prazo de 12 (doze) meses , contados da data da respectiva aceitação dos referidos equipamentos pela COMPRADORA, através da Ata de Instalação ou 15 (quinze) meses da data do faturamento ou da data de despacho no exterior, o que ocorrer primeiro.            Quando contratada pela COMPRADORA a garantia estendida, esta, vigerá conforme os termos e condições da Proposta Comercial vinculada a este instrumento.                        Os acessórios possuem prazo total de 90 (noventa) dias de garantia.                        b) A VENDEDORA executará a(s) manutenção(ões) preventiva(s) durante o período de garantia. A quantidade e recorrência é definida pela FABRICANTE do equipamento, de acordo com as normas e necessidiades determinadas de cada produto.            ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "Para os materiais, peças, acessórios ou equipamentos de terceiros comercializados pela PHILIPS, serão fornecidos a COMPRADORA os Termos de Garantia elaborados pelos respectivos fabricantes.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "O prazo de garantia para tubos de raios-x, bem como para peças à vácuo, obedecerá critérios específicos (mediante indicativo em documento próprio) e será contado da data da respectiva aceitação pela COMPRADORA através da Ata de Instalação ou do primeiro uso em paciente, ou 15 (quinze) meses da data do faturamento, o que ocorrer primeiro, conforme Anexo A ao presente termo.            a) As especificações das garantias dispostas no Anexo A ao presente termo obedecerão ao critério “pro-rata temporis” ou “pro-rata usus”, o que expirar primeiro, ambos contados à partir da data da respectiva aceitação pela COMPRADORA através da Ata de Instalação ou fornecimento definitivo do equipamento fabricado pela PHILIPS ou 15 (quinze) meses da data do faturamento, o que ocorrer primeiro, limitado ao prazo “Máximo de Garantia Após Fornecimento”.                        b) Os transdutores para aplicação em Ultrassonografia serão garantidos pelo prazo de 12 (doze) meses, contados da data da respectiva aceitação pela COMPRADORA através da Ata de Instalação ou do primeiro uso em paciente ou 15 (quinze) meses da data do faturamento, o que ocorrer primeiro.            ",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "A entrega de peças e acessórios, a título de garantia, se proveniente de processo de importação, será feito localmente pela “PHILIPS”.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "A montagem do equipamento fabricado pela PHILIPS que for feita após o vencimento do respectivo prazo de garantia por responsabilidade da COMPRADORA, será cobrada/faturada à parte, não sendo concedido, nesse caso, prazo de garantia acessório.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "Os cabeçotes de refrigeração (“COLD HEAD”) utilizados nos equipamentos de Ressonância Magnética fabricados pela PHILIPS serão considerados ítens consumíveis, sendo-lhes aplicada a garantia prevista no item 01 do presente termo.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "Excluem-se de qualquer modalidade de garantia, sob este termo, os objetos que compõem os equipamentos fabricados pela PHILIPS e que estejam sujeitos à deterioração, desgaste e/ou consumo, tais como: acumuladores, pilhas secas, objetos de borracha ou plástico, de proteção, filmes, papéis fotossensíveis, produtos químicos, bulbos incandescente, criogênicos (Exemplo: Hélio), itens com, prazos de validade determinados que se encontrarem vencidos, entre outros.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "Excluem-se também de qualquer modalidade de garantia, sob este termo, eventuais defeitos decorrentes de acidentes, manipulação incorreta ou de alteração efetuada nos equipamentos fabricados pela PHILIPS, pela COMPRADORA, seus prepostos ou terceiros, estranhos à PHILIPS ou não autorizados por ela.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "Qualquer alteração, modificação, acréscimo, reparo, retirada ou substituição de peças e/ou acessórios efetuada nos equipamentos fabricados pela PHILIPS sem a sua prévia e expressa anuência extinguirá e cancelará qualquer prazo de garantia porventura vigente.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "Após a extinção do prazo de garantia, nos termos do presente termo, toda e qualquer peça e/ou acessório, bem como todo e qualquer serviço relativo a um equipamento fabricado pela PHILIPS será devidamente cobrado/faturado à parte.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "Toda e qualquer peça e/ou componente dos equipamentos fabricados pela PHILIPS que vier a ser substituído durante a vigência do respectivo prazo de garantia deverá ser formal e definitivamente entregue à PHILIPS, que passará a ser a sua legítima proprietária.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "A responsabilidade, se houver alguma, da PHILIPS por danos resultantes do descumprimento dos termos deste termo ou de qualquer forma relacionado aos equipamentos por ela fabricados, é limitada a um valor que não exceda o preço do respectivo equipamento.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "A PHILIPS, em hipótese alguma, será responsabilizada perante a COMPRADORA em relação aos equipamentos por ela fabricados: (i) pela sua utilização inadequada por pessoas não autorizadas pela PHILIPS; (ii) pela má-fé da COMPRADORA na sua utilização; (iii) por motivos de caso fortuito ou de força maior que venham a lhes causar danos; (iv) por problemas causados por circunstâncias que estejam fora do controle da PHILIPS, tais como erros causados pelo operador dos equipamentos, problemas causados por falha elétrica do local onde os equipamentos estiverem instalados e problemas causados aos equipamentos por ações da Natureza.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "Classifica-se como má utilização a não observância estrita dos requisitos técnicos de energia elétrica, temperatura e umidade expressos no manual do equipamento, assim como é mandatória a ausência de pó ou qualquer outro elemento estranho ao equipamento. A não observância destes requisitos causará a imediata cessação da garantia contratual, e isenta a Philips de qualquer responsabilidade sobre o funcionamento inadequado do equipamento.",
            numbering: {
              reference: "my-crazy-numbering",
              level: 3,
            }
          }),
          new Paragraph({
            text: "            ANEXO III            ",
            heading: HeadingLevel.HEADING_2,
            bold: true,
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph("CONDIÇÕES DE GARANTIA PARA TUBOS E PEÇAS A VÁCUO")
                    ]
                  })
                ],
                width: {
                  size: 1000000,
                  type: WidthType.DXA
                },
                tableHeader: true,
              })
            ]
          })
        ],
      }]
    });

    /*sections: [
        {
            properties: {},
            children: [
              new Paragraph({
                text: "As presentes Condições Gerais de Venda (“Condições de Venda”) regulam as relações comerciais cujo objeto seja a venda de equipamentos e/ou produtos (“FORNECIMENTO”), conforme estabelecido na Proposta Técnica e Comercial e anexos entre a PHILIPS MEDICAL SYSTEMS LTDA. (“Philips” ou “CONTRATADA”) e o COMPRADOR“COMPRADOR).",
                
            }),
            new Paragraph({
              heading: HeadingLevel.HEADING_3,
              
              children: [
                new TextRun({
                  style: "strikeUnderlineCharacter",
                  text: "1. VALIDADE DA PROPOSTA E DAS CONDIÇÕES DE VENDA",
                }),
              ]
              
          }),
            ],
        },
    ],
});*/
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "teste.docx")
    });
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>

      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <input type="file" onChange={handleFileUpload} />
        <div>Valor da chave "Cond. Pagto": {paymentCondition}</div>
        <ul>
          {rows.map((group, groupIndex) => (
            <li key={groupIndex}>
              {group.map((item, itemIndex) => (
                <span key={itemIndex}>
                  {`ID: ${item.id}, Description: ${item.description}, Quantity: ${item.quantity}`}
                </span>
              ))}
            </li>
          ))}
        </ul>
        <button onClick={startPdf}>
          Testando o docx
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )

  
}

export default App

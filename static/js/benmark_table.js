var colorFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    var rowData = cell.getRow().getData();

    if (value === "-" || value === undefined || value === null) return "-";

    var isTarget = rowData.Setting === "De-context";
    var weight = isTarget ? "900" : "400";
    var size = isTarget ? "1.05em" : "1em";

    return `<span style="font-weight: ${weight}; font-size: ${size};">${value}</span>`;
}

var deltaFormatter = function (cell, formatterParams) {
    var value = cell.getValue();
    var rowData = cell.getRow().getData();

    if (value === "-" || value === undefined || value === "" || value === null) return `<span style="color: #999; font-size: 0.8em;">-</span>`;

    var numValue = parseFloat(value);
    var color = numValue >= 0 ? '#000000' : '#000000';
    var sign = (numValue > 0 && !String(value).includes('+')) ? '+' : '';

    var isTarget = rowData.Setting === "De-context";

    var weight = isTarget ? "900" : "400";
    var size = isTarget ? "0.95em" : "0.85em";

    return `<span style="color: ${color}; font-weight: ${weight}; font-size: ${size};">${sign}${value}</span>`;
};

var settingFormatter = function (cell) {
    var value = cell.getValue();
    var style = "";

    if (value === "Direct") {
        style = "background-color: #d1eefc; color: #208bba;";
    } else if (value === "Guided") {
        style = "background-color: #ffe8cc; color: #d97706;";
    } else if (value === "De-context") {
        style = "background-color: #fce1ed; color: #d61f69;";
    }

    var length = String(value || "").length;
    var fontSize = length > 12 ? "0.72em" : length > 10 ? "0.78em" : "0.85em";

    return `<span style="${style} padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: ${fontSize}; display: inline-block; min-width: 80px; white-space: nowrap;">${value}</span>`;
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('static/data/leaderboard_data.json')
        .then(response => response.json())
        .then(tableData => {

            var ureasonTable = new Tabulator("#ureason-main-table", {
                data: tableData,
                layout: "fitColumns",
                responsiveLayout: "collapse",
                movableColumns: false,
                sortableConfig: false,

                rowFormatter: function (row) {
                    var data = row.getData();
                    var element = row.getElement();
                    var index = row.getPosition();

                    var groupIndex = Math.floor((index - 1) / 3);

                    var groupColor = groupIndex % 2 === 0 ? "#ffffff" : "#f8f9fa";

                    element.style.backgroundColor = groupColor;

                    var cells = element.querySelectorAll('.tabulator-cell');
                    var modelCell = null;
                    cells.forEach(function (cell) {
                        if (cell.getAttribute('tabulator-field') === 'Model') {
                            modelCell = cell;
                        }
                    });

                    if (modelCell) {
                        modelCell.style.backgroundColor = groupColor;

                        if (data.Setting === "Direct") {
                            modelCell.style.borderBottom = "none";
                        } else if (data.Setting === "Guided") {
                            modelCell.style.borderTop = "none";
                            modelCell.style.borderBottom = "none";
                        } else if (data.Setting === "De-context") {
                            modelCell.style.borderTop = "none";
                            modelCell.style.borderBottom = "1px solid #e5e7eb";
                        }
                    }
                },

                columnDefaults: {
                    tooltip: true,
                    headerHozAlign: "center",
                    headerVAlign: "middle",
                    hozAlign: "center",
                    headerWordWrap: true,
                },
                columns: [
                    {
                        title: "Model",
                        field: "Model",
                        hozAlign: "center",
                        vertAlign: "middle",
                        widthGrow: 1.5,
                        minWidth: 120,
                        formatter: function (cell) {
                            var value = cell.getValue();
                            var row = cell.getRow();
                            var data = row.getData();

                            if (data.Setting === "Guided") {
                                var length = String(value || "").length;
                                var fontSize = length > 20 ? "0.78em" : length > 16 ? "0.86em" : length > 12 ? "0.94em" : "1.02em";

                                return `<span style="color:#1a80ea; font-weight:bold; font-size: ${fontSize}; white-space: nowrap;">${value}</span>`;
                            }
                            return "";
                        },
                        cellClick: function (e, cell) {
                            e.stopPropagation();
                        },
                        headerSort: false
                    },
                    {
                        title: "Setting",
                        field: "Setting",
                        hozAlign: "center",
                        vertAlign: "middle",
                        widthGrow: 1.5,
                        minWidth: 120,
                        formatter: settingFormatter,
                        headerSort: false
                    },
                    {
                        title: "Code",
                        columns: [
                            { title: "Acc", field: "Code_Acc", widthGrow: 1, minWidth: 60, formatter: colorFormatter, headerSort: false },
                            { title: "Δ", field: "Code_Delta", widthGrow: 1, minWidth: 60, formatter: deltaFormatter, headerSort: false },
                        ]
                    },
                    {
                        title: "Arithmetic",
                        columns: [
                            { title: "Acc", field: "Arithmetic_Acc", widthGrow: 1, minWidth: 60, formatter: colorFormatter, headerSort: false },
                            { title: "Δ", field: "Arithmetic_Delta", widthGrow: 1, minWidth: 60, formatter: deltaFormatter, headerSort: false },
                        ]
                    },
                    {
                        title: "Spatial",
                        columns: [
                            { title: "Acc", field: "Spatial_Acc", widthGrow: 1, minWidth: 60, formatter: colorFormatter, headerSort: false },
                            { title: "Δ", field: "Spatial_Delta", widthGrow: 1, minWidth: 60, formatter: deltaFormatter, headerSort: false },
                        ]
                    },
                    {
                        title: "Attribute",
                        columns: [
                            { title: "Acc", field: "Attribute_Acc", widthGrow: 1, minWidth: 60, formatter: colorFormatter, headerSort: false },
                            { title: "Δ", field: "Attribute_Delta", widthGrow: 1, minWidth: 60, formatter: deltaFormatter, headerSort: false },
                        ]
                    },
                    {
                        title: "Text",
                        columns: [
                            { title: "Acc", field: "Text_Acc", widthGrow: 1, minWidth: 60, formatter: colorFormatter, headerSort: false },
                            { title: "Δ", field: "Text_Delta", widthGrow: 1, minWidth: 60, formatter: deltaFormatter, headerSort: false },
                        ]
                    },
                    {
                        title: "Overall",
                        columns: [
                            {
                                title: "Acc", field: "Overall_Acc",
                                widthGrow: 1.2, minWidth: 70,
                                formatter: colorFormatter, // 这里使用了新的 formatter，会根据行判断是否加粗
                                // cssClass: "font-weight-bold", // <--- 删除了这一行，避免强制全部加粗
                                headerSort: false
                            },
                            {
                                title: "Δ", field: "Overall_Delta",
                                widthGrow: 1.2, minWidth: 70,
                                formatter: deltaFormatter,
                                headerSort: false
                            },
                        ]
                    },
                ],
            });
        })
        .catch(error => console.error('Error loading UReason data:', error));
});
import React from "react";
import { Chart } from "react-google-charts";

class Charts extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      sales: [],
      todayData: [],
    };
  }

  componentDidMount(): void {
    this.filterSalesToday();
  }

  getDate = (date: any) => {
    const newDate = new Date(date);
    return newDate;
  };

  filterSalesToday = () => {
    let date = new Date();

    let formatedDate: any;

    if (date.getMonth() + 1 < 10) {
      formatedDate = `${date.getDate()}/0${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
    } else {
      formatedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
    }

    let data = [[formatedDate, "Valor"]];

    const periodStart = this.getDate((date.setHours(0), date.setMinutes(0)));
    const periodEnd = new Date();

    const salesToday = this.props.sales?.filter(
      (sale: any) =>
        this.getDate(sale.data.createdAt.date) >= periodStart &&
        this.getDate(sale.data.createdAt.date) <= periodEnd
    );

    for (let i = 0; i < salesToday.length; i++) {
      let gotDate = this.getDate(salesToday[i].data.createdAt.date);

      let time = `${gotDate.getHours()}:${gotDate.getMinutes()}`;

      let newData = [time, salesToday[i].data.total];

      data.push(newData);
    }

    this.setState({ todayData: data });
  };

  render() {
    let optionsPeriod = {
      chart: {
        title: "Vendas",
        subtitle: "Vendas (Período)",
        colors: ["#24212a", "#24212a", "#24212a", "#24212a", "#24212a"],
      },
    };

    let dataPeriod = [
      ["Periodo", "Vendas"],
      ["Hoje", this.props.salesToday],
      ["7 Dias", this.props.salesLastWeek],
      ["30 Dias", this.props.salesLastMonth],
      ["Todas", this.props.sales.length],
    ];

    return (
      <section className="container d-flex justify-content-center align-items-center mt-4">
        <div className="d-flex justify-content-center col-10">
          <Chart
            className="dark"
            chartType="Bar"
            data={dataPeriod}
            options={optionsPeriod}
            width={"80%"}
            height={"400px"}
          />
        </div>
      </section>
    );
  }
}

export default Charts;

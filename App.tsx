import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity,Modal,ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [buttonExpanded,setButtonExpanded] = useState(false)
  const [modalOpen,setModalOpen] = useState(false)
  const [incomes, setIncomes] = useState([5000,2000,800])
  const [expenses, setExpenses] = useState([600,400,200])
  const [totalIncome,setTotalIncome] = useState(0)
  const [totalExpense,setTotalExpense] = useState(0)

  type Entry = {
      name:string,
      value: number
  }

  const prefIncome = [
    {
    name: 'Salário',
    value: 5000
  },    
  {
    name: 'Renda Extra',
    value: 2000
  },
  {
    name: 'Aluguel',
    value: 500
  },

]

  const prefExpense = [
  {
    name: 'Aluguel',
    value: 600
  },
  {
    name: 'Cartões',
    value: 400
  },    
  {
    name: 'Luz',
    value: 200
  },

  ]

  let user:{
    currentMonth:{
      date:string,
      incomes:number[],
      expenses:number[],
      investments:Array<Entry>,
      cards:Array<Entry>,
    },
    previousEntries:[
      {
        date:string,
        incomes:number[],
        expenses:number[],
        investments:Array<Entry>,
        cards:Array<Entry>,
      }
    ],
    prefIncome: Object[],
    prefExpense: Object[]
  }

  user = {
    currentMonth:{
      date:'',
      incomes:incomes,
      expenses:expenses,
      investments: [
        {
          name: 'Poupança',
          value:10000,
        },
        {
            name: 'Ações',
            value:5000,
          }
      ],
      cards:[
        {
          name: 'Nubank Físico',
          value:120
        },
        {
          name: 'Nubank Virtual',
          value:20
        }
      ],
    },
    previousEntries:[
      {
        date:'',
        incomes:incomes,
        expenses:expenses,
        investments: [
          {
            name: 'Poupança',
            value:10000,
          }
        ],
        cards:[
          {
            name: '',
            value:0
          }
        ],
      }
    ],
    prefIncome: prefIncome,
    prefExpense: prefExpense
  }

  const handleModal = () => {
    setModalOpen(!modalOpen)
  }
  const pressDetail = () => {
    setButtonExpanded(!buttonExpanded)
  }

  useEffect(()=>{
    let temp = 0;
    for(let i=0; i < incomes.length; i++){
      temp = temp + incomes[i]
    }
    setTotalIncome(temp)
  },[incomes])

  useEffect(()=>{
    let temp = 0;
    for(let i=0; i < expenses.length; i++){
      temp = temp + expenses[i]
    }
    setTotalExpense(temp)
  },[expenses])


  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

  return (
    <View style={styles.container}>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(!modalOpen);
        }}
      >
        <TouchableOpacity style={styles.centeredView} onPress={handleModal}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Minha conta</Text>

          </View>
        </TouchableOpacity>

      </Modal>

      <View style={styles.SmallBox}>
        <View style={{width:'80%',height:'90%', display:'flex',  flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
          <View style={{height:'80%',width:'20%', backgroundColor:'#939DF0', borderRadius:20}}></View>
          <Text style={{color:'white',marginHorizontal:'5%', fontSize:18}}>Olá, Rafael!</Text>
        </View>
        <TouchableOpacity onPress={handleModal}>
          <Icon name="notifications-outline" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={buttonExpanded? styles.ExtendedBox: styles.LargeBox}>
        <TouchableOpacity style={styles.box} onPress={pressDetail}>
          <Text style={{color:'white'}}>Balanço total</Text>
          <Text style={{color:'white'}}>R$ <Text style={{fontSize:30}}>{totalIncome}</Text></Text>

          {buttonExpanded? 
          <View style={styles.details}>
            <Text style={{color:'white'}}>Salário: R$ 5000</Text>
            <Text style={{color:'white'}}>Renda Extra: R$ 2000</Text>
            <Text style={{color:'white'}}>Aluguel: R$ 500</Text>
          </View>
          :
          <></>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Text style={{color:'white'}}>Despesas</Text>
          <Text style={{color:'white'}}>R$ <Text style={{fontSize:30}}>{totalExpense}</Text></Text>


          {buttonExpanded? 
          <View style={styles.details}>
            <Text style={{color:'white'}}>Aluguel: R$ 600</Text>
            <Text style={{color:'white'}}>Cartões: R$ 400</Text>
            <Text style={{color:'white'}}>Luz: R$ 200</Text>
          </View>
          :
          <></>
          }

        </TouchableOpacity>
      </View>

      {!!user.currentMonth.investments?       
      <View style={styles.LargeBox}>
            <View style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-start',paddingLeft:20}}>
                    <Text style={{color:'white', fontSize:24}}>Meus Investimentos</Text>
                        {user.currentMonth.investments.map((investment) => {
                            return (
                                <View style={styles.investiments} key={investment.name}>
                                    <Text style={{color:'white'}}>{investment.name}</Text>
                                    <Text style={{color:'white'}}>R${investment.value}</Text>
                                </View>
                            )
                        })}
            </View>
      </View>
      :
        <></>
      }

    {!!user.currentMonth.cards?       
      <View style={styles.LargeBox}>
            <View style={{width:'100%', display:'flex', justifyContent:'flex-start', alignItems:'flex-start',paddingLeft:20}}>
            <Text style={{color:'white', fontSize:24}}>Meus Cartões</Text>
                        {user.currentMonth.cards.map((card) => {
                            return (
                                <View style={styles.card} key={card.name}>
                                    <Text style={{color:'white'}}>{card.name}</Text>
                                    <Text style={{color:'white'}}>R${card.value}</Text>
                                </View>
                            )
                        })}
            </View>
      </View>
      :
        <></>
      }

      <StatusBar style="auto" />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191C47',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#555555'
  },
  box:{
    height:'80%',
    width:'45%',
    margin:"1%",
    paddingTop:"5%",
    backgroundColor:'#2B2A66',
    borderRadius:20,
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  SmallBox:{
    height:'10%',
    width:'100%',
    marginVertical:15,
    borderRadius:20,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  LargeBox:{
    height:'20%',
    width:'100%',
    marginVertical:20,
    borderRadius:20,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  ExtendedBox:{
    height:'40%',
    width:'100%',
    marginBottom:10,
    borderRadius:20,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  card:{
    backgroundColor:'#FC9BC5',
    borderRadius:25,
    margin:5,
    height: '50%',
    width:'90%',
    padding:20,
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around'
  },
  investiments:{
    backgroundColor:'#7767E2',
    borderRadius:10,
    margin:2,
    width:'90%',
    padding:20,
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around'
  },
  details:{
    marginTop:"5%",
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'flex-start'

  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginRight:"5%",
    marginTop: "5%"
  },
  modalView: {
    margin: 20,
    backgroundColor: "#2B2A66",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5
  },
  modalText:{
    color:'white'
  }
});

import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler } from 'react';

interface CustomerProps {
    customer:{
        id: number
        name: string
        deposit: number
        amount_left: number
        give_leftover: number
        guardian_name: string
        purchases: [{
            id: number
            amount: number
        }]
        deposits: [{
            id: number
            amount: number
        }]
    } 
};

export default function Customer({customer}: CustomerProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: "",
        customer_id: customer.id,
        deposit: "",
        id: customer.id
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('register_purchase'), {
            onFinish: () => reset('amount'),
        }); 
    }

    const submitDeposit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('register_deposit'), {
            onFinish: () => reset('deposit'),
        }); 
    }

    const deleteCustomer = (id: string | number) => {
       axios.delete('/api/customer/' + id)
        .then(response => {
            window.location.href = "/dashboard";
        })
        .catch(error => {console.log(error)})
    }

    return (
        <AuthenticatedLayout>
            <Head title="Deltagare" />

            <section className='section'>
                <div className="container is-max-desktop">
                    <h1 className="title is-2">{customer.name}</h1> 
                        <div className='container is-centered'>
                             <div className="box">
                             <h2 className='title is-4'>Saldo: {customer.amount_left ? customer.amount_left : 0} kr</h2>
                                <p>Inbetalad summa: {customer.deposit ? customer.deposit : 0} kr</p>
                                <p>Vårnadshavare: {customer.guardian_name}</p>
                                <p>Ge ev överblivet saldo till vBytes: {customer.give_leftover ? "Ja" : "Nej"}</p>
                            </div>

                            <div className="box">
                                <h2 className='title is-4'>Registrera köp</h2>
                                <form onSubmit={submit}>
                                    <div className="field">
                                        <div className="control">
                                            <TextInput
                                                required
                                                className="input" 
                                                type="number" 
                                                name="amount" 
                                                value={data.amount}
                                                placeholder="Summa"
                                                min={0}
                                                //max={customer.amount_left}
                                                onChange={(e) => setData('amount', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button className="button">Spara</button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="box">
                                <h2 className='title is-4'>Inbetalning Swish/kontant</h2>
                                <form onSubmit={submitDeposit}>
                                    <div className="field">
                                        <div className="control">
                                            <TextInput
                                                required
                                                className="input" 
                                                type="number" 
                                                name="deposit" 
                                                value={data.deposit}
                                                placeholder="Summa"
                                                onChange={(e) => setData('deposit', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button className="button">Spara</button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <details className="box">
                                <summary className='title is-4 my-3'>
                                    <span>Köp</span>
                                    <div className="summary-chevron-up">
			                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-down">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
		                            </div>
                                </summary>
                                {customer.purchases && customer.purchases.map( purchase => {
                                    return <div key={purchase.id} className="box">
                                        <p>{purchase.amount} kr</p>
                                    </div>
                                })}
                                <div className="summary-chevron-down">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-up">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </div>
                            </details>
                            <details className="box">
                                <summary className='title is-4 my-3'>
                                    <span>Inbetalningar</span>
                                    <div className="summary-chevron-up">
			                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-down">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
		                            </div>
                                </summary>
                                {customer.deposits && customer.deposits.map( deposit => {
                                    return <div key={deposit.id} className="box">
                                        <p>{deposit.amount} kr</p>
                                    </div>
                                })}
                                <div className="summary-chevron-down">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-up">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </div>
                            </details>
                        </div>
                    <button onClick={() => deleteCustomer(customer.id)} className="button mt-4 is-danger is-outlined is-small">
                        <span>Radera deltagare</span>
                    </button>
                </div>
            </section>
            
        </AuthenticatedLayout>
    );
}

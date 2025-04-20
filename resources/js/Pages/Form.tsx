
import Checkbox from '@/Components/Checkbox';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Form() {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        guardian_name: '',
        give_leftover: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('register_customer'), {
            onFinish: () => reset('name','guardian_name', 'give_leftover'),
        }); 
    }

    return (
        <div>
            <Head title="Form" />

            
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                        <img className="form-logo" src="/img/logo.png" />
                        <h1 className='title is-3 mb-2'>Registering av deltagare</h1>
                        <p className="subtitle is-6">Fyll i deltagarens och dina uppgifter. Swisha/Betala sedan in en önskad summa pengar och meddela kioskpersonal</p>
                        <p></p>
                        <form onSubmit={submit}>
                            <div className="field">
                                <label className="label">Deltagarens namn</label>
                                <div className="control">
                                     <TextInput
                                        required
                                        className="input" 
                                        type="text" 
                                        name="name" 
                                        value={data.name}
                                        placeholder="Namn"
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Vårnadshavares namn</label>
                                <div className="control">
                                     <TextInput
                                        required
                                        className="input" 
                                        type="text" 
                                        name="guardian_name" 
                                        value={data.guardian_name}
                                        placeholder="Namn"
                                        onChange={(e) => setData('guardian_name', e.target.value)}
                                    />
                                </div>
                            </div>
                        
                            <div className="field">
                                <div className="control">
                                    <label className="checkbox">
                                    <Checkbox
                                        type="checkbox" 
                                        name="give_leftover"
                                        checked={data.give_leftover}
                                        onChange={(e) =>
                                            setData(
                                                'give_leftover',
                                                (e.target.checked || false) as false,
                                            )
                                        }
                                    />
                                    <span>  Jag vill ge ev överbliven summa till vBytes</span>
                                    </label>
                                </div>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <label className="checkbox">
                                    <Checkbox type="checkbox" required/>
                                    <span> Jag godkänner att mina uppgifter används.</span>
                                       
                                    </label>
                                </div>
                            </div>

                            <div className="field is-grouped">
                                <div className="control">
                                    <button className="button is-link">Spara</button>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        
    );
}

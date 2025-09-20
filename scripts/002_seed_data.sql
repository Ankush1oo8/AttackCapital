-- Seed data for Medical AI Intake Agent

-- Insert sample patients
INSERT INTO public.patients (medical_id, first_name, last_name, date_of_birth, phone, email, allergies, medical_history, emergency_contact_name, emergency_contact_phone) VALUES
('MED001', 'John', 'Doe', '1985-03-15', '+1-555-0101', 'john.doe@email.com', ARRAY['Penicillin', 'Shellfish'], 'Hypertension, Type 2 Diabetes', 'Jane Doe', '+1-555-0102'),
('MED002', 'Sarah', 'Johnson', '1990-07-22', '+1-555-0201', 'sarah.johnson@email.com', ARRAY['Latex'], 'Asthma, Seasonal Allergies', 'Mike Johnson', '+1-555-0202'),
-- Fixed empty array by casting to text array type
('MED003', 'Robert', 'Smith', '1978-11-08', '+1-555-0301', 'robert.smith@email.com', ARRAY[]::text[], 'Previous knee surgery (2020)', 'Lisa Smith', '+1-555-0302'),
('MED004', 'Emily', 'Davis', '1995-01-30', '+1-555-0401', 'emily.davis@email.com', ARRAY['Peanuts', 'Tree nuts'], 'Anxiety, Depression', 'Tom Davis', '+1-555-0402'),
('MED005', 'Michael', 'Wilson', '1982-09-12', '+1-555-0501', 'michael.wilson@email.com', ARRAY['Sulfa drugs'], 'High cholesterol, Family history of heart disease', 'Anna Wilson', '+1-555-0502');

-- Insert a sample bot configuration
INSERT INTO public.bots (name, openmic_bot_uid, domain, prompt, voice_settings, webhook_settings) VALUES
('Medical Intake Assistant', 'sample-bot-uid-123', 'medical', 
'You are a professional medical intake assistant. Your role is to:

1. Greet patients warmly and introduce yourself as the medical intake assistant
2. Ask for their Medical ID to retrieve their information
3. Verify their identity with basic information
4. Collect the reason for their visit
5. Ask about any changes to their medical history, allergies, or medications
6. Schedule follow-up appointments if needed
7. Provide clear next steps

Always maintain a professional, empathetic tone. If you cannot find a patient''s Medical ID, politely ask them to verify the ID or contact the front desk.

Remember to use the get_patient_info function when they provide their Medical ID.',
'{"voice": "alloy", "speed": 1.0}',
'{"pre_call_url": "", "post_call_url": "", "function_calls": []}');

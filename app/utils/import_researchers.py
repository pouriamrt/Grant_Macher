import pandas as pd

def import_researchers_from_excel(filepath, db, Researcher):
    df = pd.read_excel(filepath)
    df = df.loc[~df[['Diseases, conditions and populations of interest', 
                     'Research and clinical approaches']].isna().all(axis=1)].reset_index(drop=True)
    df.replace(r'^\s*$', pd.NA, regex=True, inplace=True)
    df['Name'] = df['First Name'] + " " + df['Last Name']
    df['Keywords'] = df['Diseases, conditions and populations of interest'].fillna('') + ", " + df['Research and clinical approaches'].fillna('')
    df = df[df['Keywords'].str.strip() != ""]

    for _, row in df.iterrows():
        name = row.get("Name", "")
        email = row.get("Email", "")
        
        existing_researcher = None
        if email:
            existing_researcher = Researcher.query.filter_by(email=email).first()
        if not existing_researcher and name:
            existing_researcher = Researcher.query.filter_by(name=name).first()

        if existing_researcher:
            continue

        researcher = Researcher(
            name=name,
            position=row.get("Position", ""),
            program=row.get("Program", ""),
            keywords=row.get("Keywords", ""),
            email=email
        )
        db.session.add(researcher)
    
    db.session.commit()

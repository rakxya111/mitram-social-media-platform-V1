from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE accounts_customuser 
                DROP COLUMN IF EXISTS first_name,
                DROP COLUMN IF EXISTS last_name;
            """,
            reverse_sql="""
                ALTER TABLE accounts_customuser 
                ADD COLUMN first_name VARCHAR(150),
                ADD COLUMN last_name VARCHAR(150);
            """
        )
    ]

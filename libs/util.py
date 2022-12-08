""" Python script with utility functions """
def strNoneConvert(input_data):
    """ Converting input to string if it is not a list or none """
    if input_data is None:
        return None
    if input_data is list:
        return list
    return str(input_data)


def floatNoneConvert(input_data):
    """ Converting input to float if it is not a list or none """
    if input_data is None or input_data == '':
        return None
    if input_data is list:
        return list
    return float(input_data)


def otherinputtodict(input_data):

    """ Dict [parser funtion for other inputs """
    input_parameter_dict = {}
    if not input_data is None:
        if "=" in input_data:
            input_parameter_list = input_data.split(",")
            for parameter in input_parameter_list:
                input_parameter_dict[parameter.split(
                    "=")[0]] = parameter.split("=")[1]

    return input_parameter_dict

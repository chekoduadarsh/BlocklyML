""" Python script with utility functions """
def strNoneConvert(input):
    """ Converting input to string if it is not a list or none """
    if input is None:
        return None
    if input is list:
        return list
    else:
        return str(input)


def floatNoneConvert(input):
    """ Converting input to float if it is not a list or none """
    if input is None or input == '':
        return None
    if input is list:
        return list
    else:
        return float(input)


def otherinputtodict(input):

    """ Dict [parser funtion for other inputs """
    input_parameter_dict = {}
    if not(input is None):
        if "=" in input:
            input_parameter_list = input.split(",")
            for parameter in input_parameter_list:
                input_parameter_dict[parameter.split(
                    "=")[0]] = parameter.split("=")[1]

    return input_parameter_dict
